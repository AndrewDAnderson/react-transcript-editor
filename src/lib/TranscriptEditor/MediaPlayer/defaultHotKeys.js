function returnHotKeys(self) {
  return {
    'alt+space': {
      priority: 1,
      handler: (event) => { self.playMedia();  
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'playMedia', name: 'alt+space', value: '' }) 
      },
      helperText: 'Play Media',
    },
    'esc': {
      priority: 1,
      handler: (event) => { self.playMedia();  
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'playMedia', name: 'esc', value: '' }) 
      },
      helperText: 'Play Media',
    },
    'alt+k': { // combo from mousetrap
      priority: 1,
      handler: (event) => { self.promptSetCurrentTime(); 
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'promptSetCurrentTime', name: '', value: '' }) 
      },
      helperText: 'set current time',
    },
    'alt+right': {
      priority: 1,
      handler: (event) => { self.skipForward();
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'skipForward', name: '', value: '' }) 
        },
      helperText: 'Skip Forward',
    },
    'alt+left': {
      priority: 1,
      handler: (event) => { self.skipBackward(); 
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'skipBackward', name: '', value: '' })  
      },
      helperText: 'Skip Backward',
    },
    'alt+down': {
      priority: 1,
      handler: (event) => { self.decreasePlaybackRate(); 
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'decreasePlaybackRate', name: '', value: '' });
        event.preventDefault();  
      },
      helperText: 'Speed Up ',
    },
    'alt+up': {
      priority: 1,
      handler: (event) => { self.increasePlaybackRate(); 
        self.props.handleAnalyticsEvents({ category: 'keyboardShortcuts', action: 'increasePlaybackRate', name: '', value: '' });
        event.preventDefault();
      },
      helperText: 'Speed Down',
    },
    'command+left': {
      priority: 1,
      handler: (event) => { self.rollBack(); },
      helperText: 'Roll Back',
    }
    // ,'ctrl+/': {
    //     priority: 1,
    //     handler: (event) => { console.log('show hide shortcuts');},
    //     helperText: 'Show/Hide shortcuts'
    // }
    // ,'ctrl+s': {
    //     priority: 1,
    //     handler: (event) => { console.log('save');},
    //     helperText: 'Save'
    // }
  }
}
export default returnHotKeys;
