import React from 'react'
import Color from 'color'
import styled, { css, ThemeProvider } from 'styled-components'
import { Launcher } from '@wealize/react-chat-window'

const LauncherContainer = styled.div`
  ${(props) => {
    const brandColor = Color(props.theme.brandColor);

    return css`
      & .sc-launcher,
      & .sc-header {
        background-color: ${brandColor.rgb().string()};
      }

      & .sc-header--close-button:hover {
        background-color: ${brandColor.darken(0.2).rgb().string()};
      }

      & .sc-message--content.sent .sc-message--text {
        background-color: ${brandColor.rgb().string()};
      }

      & .sc-message--content.received .sc-message--text,
      & .sc-user-input {
        background-color: ${brandColor.lighten(0.8).alpha(0.3).rgb().string()};
      }

      & .sc-user-input--text {
        background-color: initial;
      }

      & .sc-user-input.active {
        background-color: white;
      }

      & .sc-message--img {
        width: 90%;
        height: auto;
      }

      & .sc-message--video {
        width: 100%;
        height: 100%;
      }

      & .sc-message--content.sent .sc-message--text {
        background-color: ${brandColor.rgb().alpha(0.5).string()};
      }

      & .sc-quick-replies-block {
        background-color: ${brandColor.lighten(0.8).alpha(0.3).rgb().string()};
      }

      & .sc-quick-reply-button {
        border: 1px solid ${brandColor.rgb().string()};
        color: ${brandColor.rgb().string()};
        background-color: white;
      }

      & .sc-quick-reply-button:hover {
        border: 1px solid white;
        color: white;
        background-color: ${brandColor.rgb().string()};
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
