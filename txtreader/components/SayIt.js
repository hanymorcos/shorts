import { Textarea, Flex, Box,  Button, Stack } from '@chakra-ui/react'
import React, { useState, setState } from 'react';

export default function SayIt() {
  const [text, setText] = useState("");
  const [booleans, setBooleans] = useState(
    {
      speaking: false, 
      paused: false, 
      resumed: false,
      ended: false
    }
  );
  
  const clickHandler = (value) => {
    switch(value)
    {
      case 'speaking':
          var msg = new SpeechSynthesisUtterance();
          msg.text = text;
          window.speechSynthesis.speak(msg)
        break; 
      case 'resumed':
          window.speechSynthesis.resume();
        break; 
      case 'paused':
          window.speechSynthesis.pause();
        break;
      case 'ended':
          window.speechSynthesis.cancel();
        break; 
    }

    setBooleans({...booleans, [value]: !booleans[value]});
  };

  return (

    <Box>
      <Flex>
          <Box> 
                <Textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Enter some text"
                size='lg'
              />
          </Box>
        </Flex>
        <Stack spacing={1} direction='row' align='center'>
          <Box>
            <Button colorScheme='orange' size='xs' onClick={() => clickHandler('speaking')} >
              Speak
            </Button>
          </Box>
          <Box>
            <Button colorScheme='orange' size='xs' onClick={() => clickHandler('paused')} >
              pause
            </Button>
          </Box>
          <Box>
            <Button colorScheme='orange' size='xs' onClick={() => clickHandler('resumed')} >
              resume
            </Button>
          </Box>
          <Box>
            <Button colorScheme='orange' size='xs' onClick={() => clickHandler('ended')} >
              cancel
            </Button>
          </Box>
        </Stack>
    </Box>
  );
}