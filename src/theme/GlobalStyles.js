import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.burntCaramel};
    color: #ffffff;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    outline: none;
  }

  @media print {
    body {
      background: #ffffff !important;
      color: #000000 !important;
    }

    body * {
      visibility: hidden;
    }

    #printable-receipt, #printable-receipt * {
      visibility: visible;
    }

    #printable-receipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      max-width: 380px !important;
      margin: 0 auto !important;
      background: #ffffff !important;
      color: #000000 !important;
      border: 1px dashed #333333 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      padding: 24px !important;
    }

    #printable-receipt * {
      color: #000000 !important;
      background: transparent !important;
      border-color: #cccccc !important;
      text-shadow: none !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;