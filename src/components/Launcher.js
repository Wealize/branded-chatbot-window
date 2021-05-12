import React from 'react'

import styled, { css } from 'styled-components'
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

export default ({ ...props }) => (
  <LauncherContainer>
    <Launcher {...props} />
  </LauncherContainer>
)
