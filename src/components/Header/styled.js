import styled from 'styled-components';

export const Logo = styled.div`
width: 180px;
height: 69px;
background: center / contain no-repeat url(/little-race-logo.png);
margin: 0 24px 0 0;
float: left

@media (max-width: 767px) {
    flex-direction: column;
  }
`