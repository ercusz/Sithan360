import { NavLink } from "remix";
import { IconButton, Button, Heading, Text, Flex, Box, HStack, Link as ChakraLink, Spacer, useColorMode } from "@chakra-ui/react";
import { getColor } from '@chakra-ui/theme-tools'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Switch } from "../switch"
import { useTheme } from "@emotion/react";
import { FcOldTimeCamera } from 'react-icons/fc'
import { VscGithub } from 'react-icons/vsc'
import { useTypewriter, Cursor} from 'react-simple-typewriter'

export default function NavBar({colorMode, toggleColorMode, theme}: {colorMode: any, toggleColorMode: any, theme: any}) {
    const {text} = useTypewriter({
        words: ['ภาพบรรยากาศ', 'บริเวณรอบ ๆ บึงสีฐาน', ...colorMode === 'dark' ? ['ในยามค่ำคืน🌙'] : ['ในยามเช้า☀'] ],
        loop: 0,
    })

    return (
        <Flex as="nav" p={3} align='center'>
            <HStack spacing={1}>
                <FcOldTimeCamera size={42}/>
                <Heading size='md'>
                    <span>{text}</span>
                    <Cursor />
                </Heading>
            </HStack>
            <Spacer />
            <HStack spacing={4}>
                <Switch
                    aria-label="Toggle color mode"
                    leftIcon={<FaMoon color={getColor(theme, 'yellow.400')} />}
                    rightIcon={<FaSun color={getColor(theme, 'orange.300')} />}
                    isChecked={colorMode === 'dark'}
                    onChange={() => toggleColorMode()}
                />
                <ChakraLink href="https://github.com/ercusz/Sithan360" isExternal>
                    <IconButton aria-label='GitHub' icon={<VscGithub size={30} />} />
                </ChakraLink>
            </HStack>
        </Flex>
    );
}