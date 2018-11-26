import React from 'react';
import PropTypes from 'prop-types';

import {
  // Draft,
  Editor,
  EditorState,
  // ContentState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';

import Word from './Word';
import Hashtag from './Hashtag';
import sttJsonAdapter from './adapters/index.js';
import styles from './index.module.css';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData,
      isEditable: this.props.isEditable,
      sttJsonType: this.props.sttJsonType,
      inputCount: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.transcriptData !== null) {
      return {
        transcriptData: nextProps.transcriptData,
        isEditable: nextProps.isEditable
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transcriptData !== this.state.transcriptData) {
      this.loadData();
    }
  }

  onChange = (editorState) => {
    const currentBlockKey = editorState.getSelection().getStartKey();
    const lastChangeType = editorState.getLastChangeType();
    // console.log('currentBlockKey: ',currentBlockKey);
    // console.log('lastChangeType: ',lastChangeType);
    if (this.state.isEditable) {
      this.setState((prevState, props) => ({
        editorState,
        inputCount: prevState.inputCount + 1,
        currentBlockKey
      }), () => {
        // Saving every 5 keystrokes
        if (this.state.inputCount > 5) {
          this.setState({
            inputCount: 0,
          });

          this.localSave(this.props.mediaUrl);
        }
      });
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(this.props.transcriptData, this.props.sttJsonType);
      this.setEditorContentState(blocks)
    }
  }

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  handleDoubleClick = (event) => {
    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      // TODO: prop to jump to video <-- To connect with MediaPlayer
      // this.props.seek(t);
      this.props.onWordClick(t);
      // TODO: pass current time of media to TimedTextEditor to know what text to highlight in this component
    }
  }

  localSave = () => {
    const mediaUrl = this.props.mediaUrl;
    const data = convertToRaw(this.state.editorState.getCurrentContent());
    localStorage.setItem(`draftJs-${ mediaUrl }`, JSON.stringify(data));
    const newLastLocalSavedDate = new Date().toString();
    localStorage.setItem(`timestamp-${ mediaUrl }`, newLastLocalSavedDate);
    return newLastLocalSavedDate;
  }

  // eslint-disable-next-line class-methods-use-this
  isPresentInLocalStorage(mediaUrl) {
    const data = localStorage.getItem(`draftJs-${ mediaUrl }`);
    if (data !== null) {
      return true;
    }
    return false;
  }

  loadLocalSavedData(mediaUrl) {
    const data = JSON.parse(localStorage.getItem(`draftJs-${ mediaUrl }`));
    if (data !== null) {
      const lastLocalSavedDate = localStorage.getItem(`timestamp-${ mediaUrl }`);
      this.setEditorContentState(data)
      return lastLocalSavedDate;
    }
    return ''
  }

  // set DraftJS Editor content state from blocks
  // contains blocks and entityMap

  /**
   * @param {object} data - draftJs content
   * @param {object} data.entityMap - draftJs entity maps - used by convertFromRaw
   * @param {object} data.blocks - draftJs blocks - used by convertFromRaw
   */
  setEditorContentState = (data) => {
    const contentState = convertFromRaw(data);
    // eslint-disable-next-line no-use-before-define
    const editorState = EditorState.createWithContent(contentState, this.getDecorator());
    this.setState({ editorState });
  }

  getEditorContent = (sttType) => {
    // sttType used in conjunction with adapter/convert
    const type = sttType === null ? 'draftjs' : sttType;
    const data = convertToRaw(this.state.editorState.getCurrentContent());

    return data;
  }

  // decorator definition - Draftjs
  // defines what to use to render the entity
  getDecorator = () => {
    return new CompositeDecorator([
      {
        strategy: this.getEntityStrategy('MUTABLE'),
        component: Word
      },
      {
        strategy: this.hashtagStrategy,
        component: Hashtag
      }
    ]);
  }

  // DraftJs decorator to recognize which entity is which
  // and know what to apply to what component
  getEntityStrategy = (mutability) => (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };

  hashtagStrategy = (contentBlock, callback, contentState) => {
    // https://draftjs.org/docs/api-reference-content-block.html#getdata
    // https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator

    const text = contentBlock.getText();
    // TODO: now it hadles only first word in paragraph, could change to
    // do for every word within paragraph
    const data = contentState.getEntity(contentBlock.getEntityAt(0)).getData();

    // TODO: Loop through all words, and add words beofre (or after timecode) to
    // range to return in callback
    // TODO: calculate start and end of range
    if(data.start < this.props.currentTime){
      console.log('data.start < this.props.currentTime', data.start , this.props.currentTime)
    }

    // let matchArr, start;
    // const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;
    // while ((matchArr = HASHTAG_REGEX.exec(text)) !== null) {
    //   start = matchArr.index;
    //   callback(start, start + matchArr[0].length);
    // }
  }

  render() {
    return (
      <section >
        <section
          className={ styles.editor }
          onDoubleClick={ event => this.handleDoubleClick(event) }
          // onClick={ event => this.handleOnClick(event) }
        >
          {/* <p> {JSON.stringify(this.state.transcriptData)}</p> */}
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            stripPastedStyles
          />
        </section>
      </section>
    );
  }
}

TimedTextEditor.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  onWordClick: PropTypes.func,
  sttJsonType: PropTypes.string
};

export default TimedTextEditor;
