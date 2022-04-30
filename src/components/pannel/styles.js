import styled from 'styled-components';
import * as palette from '../../styles/variables';

export const SearchSection = styled.div`
margin: 0 0  60px 0;
  .ant-input {
    padding: 11px 24px;
    box-shadow: none !important;
    background: none !important;
    outline: none !important;
    border: none !important;
}
`;

export const NavSection = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
#logo {
width: 150px;
}
#nav_tabs {
    display: flex;
align-items: center;
justify-content: space-between;
}
#nav_tabs p {
    font-size: 20px;
margin: 0 0 0 30px;
color: #74a6cc;
cursor: pointer;
}
#nav_tabs .active {
    color: #237ea6;
}
`;