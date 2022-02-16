import { ChakraProvider, Text } from '@chakra-ui/react'
import { theme } from '~/theme'
export default function WelcomeMessage() {
    return (
        <>
        <ChakraProvider theme={theme}>
            <Text
                textColor='white'
                fontSize='6xl'
                fontWeight='extrabold'
                textShadow='2px 2px black'
                textAlign='center'
                >
                Welcome to Sithan360
            </Text>
        </ChakraProvider>
        </>
    )
}