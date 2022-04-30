import styled from 'styled-components';
import * as palette from '../../styles/variables';

export const CardsSection = styled.div`
  background: ${palette.WHITE_COLOR};
  display: flex;
  padding: 0 1vw;
  cursor: pointer;
  #card{ 
    border-radius: 20px;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 18px 40px rgba(0, 0, 0, 0.06);
  }
  #card:hover {
    box-shadow: none;
  }
  #card img {
    object-fit: cover;
  }
  #card #card_data {
    display: flex;
    align-items:center;
    justify-content: space-between;
  }
  #card #card_data h2 {
    font-size: 22px;
  }
`;