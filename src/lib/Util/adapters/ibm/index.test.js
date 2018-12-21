import ibmToDraft from './index';

import draftTranscriptExample from './sample/ibmToDraft.sample.js';
import ibmTedTalkTranscript from './sample/ibmTedTalkTranscript.sample.json';

// TODO: figure out why the second of these two tests hang 
// might need to review the draftJS data structure output
describe('bbcKaldiToDraft', () => {
  const result = ibmToDraft(ibmTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptExample);
  });
});
