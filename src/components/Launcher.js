import React from 'react'

import styled, { css, ThemeProvider } from 'styled-components'
import { Launcher } from '@wealize/react-chat-window'

const LauncherContainer = styled.div`
  ${(props) => {
    return css`
      & .sc-launcher {
        z-index: 999999;
      }

      & .sc-chat-window {
        z-index: 999999;
      }
    `
  }}
`

export default ({ theme, ...props }) => (
  <ThemeProvider theme={theme}>
    <LauncherContainer>
      <Launcher {...props} />
    </LauncherContainer>
  </ThemeProvider>
)
