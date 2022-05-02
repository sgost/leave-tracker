import styled from 'styled-components';
import * as palette from '../../styles/variables';

export const SearchSection = styled.div`
margin: 60px 0  60px 0;
  .ant-input {
    padding: 11px 24px;
    box-shadow: none !important;
    background: none !important;
    outline: none !important;
    border: none !important;
}

#filters {
    display: flex;
    align-tems: center;
    justify-content: space-between;
    margin: 20px 0 0 0;
}
#filters p {
    cursor: pointer;
padding: 2px 10px;
background: purple;
box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 18px 40px rgba(0, 0, 0, 0.06);
border-radius: 30px;
color: white;
font-weight: bold;
}
`;

export const NavSection = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
#logo {
width: 150px;
cursor: pointer;
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