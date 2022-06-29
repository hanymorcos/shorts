import React from 'react';
import SayIt from '../components/SayIt';
import { Container, Stack, Heading, Text } from '@chakra-ui/react';

import NoSSR from 'react-no-ssr';

export default function Home() {

  return (

    <Container maxW={'5xl'}>
    <Stack
    boxShadow="xs" p="6" rounded="md"
      textAlign={'center'}
      align={'center'}
      spacing={{ base: 4, md: 3 }}
      py={{ base: 4, md: 4 }}>
      <Heading
        fontWeight={300}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
        lineHeight={'110%'}>
        <Text color="#C0C0C0" bgColor="black"> Silver Coder</Text>
        <Text as={'span'} color={'orange.400'}>
          NextJs Text to Speech
        </Text>
      </Heading>
      <NoSSR>
        <SayIt></SayIt>
      </NoSSR>
    </Stack>
  </Container>
  )
}
