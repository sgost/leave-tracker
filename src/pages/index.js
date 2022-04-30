import React, { Fragment, useEffect, useState } from "react"

import { Card, Col, Row, Avatar, Badge, Input, Pagination } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import { SearchSection, NavSection } from "../components/pannel/styles";
import { CardsSection } from "../components/cards/styles";


import SEO from "../components/seo"

const IndexPage = () => {
  const { Search } = Input;

  const [charData, setCharData] = useState();
  const [tabs, setTabs] = useState('Character');

  const ApiSelection = tabs == 'Character' ? 'character' : tabs == 'Location' ? "location" : tabs == 'Episode' ? "episode" : "";

  console.log('https://rickandmortyapi.com/api/character/Rick')

  useEffect(() => {
    fetchMovies()
  }, [tabs])
  async function fetchMovies() {
    const response = await fetch('https://rickandmortyapi.com/api/' + (ApiSelection));
    const result = await response.json()
    setCharData(result);
    console.log(result);
  }

  return (
    <Fragment>
      <SEO title="Home" description="Gatsby is a React-based open source framework with performance, scalability and security built-in." keywords={['gatsby', 'react']} />
      <NavSection>
        <img src='https://i.dlpng.com/static/png/6975728_preview.png' id="logo" />
        <div id="nav_tabs">
          <p onClick={() => setTabs('Character')} className={tabs == 'Character' ? "active" : ""}>Character</p>
          <p onClick={() => setTabs('Location')} className={tabs == 'Location' ? "active" : ""}>Location</p>
          <p onClick={() => setTabs('Episode')} className={tabs == 'Episode' ? "active" : ""}>Episode</p>
        </div>
      </NavSection>

      <SearchSection>
        <Search
          placeholder="Search..."
          allowClear
          enterButton="Search"
          size="large"
          onSearch=""
        />

        <div id="status">

        </div>
      </SearchSection>
      <CardsSection >
        <Row gutter={[32, 52]}>
          {charData?.results.map((item, i) =>
            <Col span={8}>
              <Badge.Ribbon text={item.status} style={{ background: item.status == 'Alive' ? 'green' : item.status == 'Dead' ? "red" : item.status == 'unknown' ? "purple" : "" }}>
                <Card bordered={false}
                  cover={
                    <img
                      alt={item.name}
                      src={item.image ? item.image : `https://www.pngkit.com/png/full/112-1128909_rick-and-morty-transparent-png-fondos-de-pantalla.png`}
                      style={{ borderRadius: `20px 20px 0 0` }}
                    />
                  } id="card">
                  <div id="card_data">
                    <h2>{item.name}</h2>
                    <div id="detail_container">
                      <Badge count={item.species} style={{ background: item.species == 'Human' ? '#942dbd' : item.species == 'Alien' ? "#26825f" : "#7bbda3" }} />
                      <Badge count={item.gender} style={{ background: item.gender == 'Male' ? '#c3cc1f' : item.gender == 'Female' ? "#1fbbcc" : "", margin: `0 0 0 10px` }} />
                    </div>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          )}
        </Row>
      </CardsSection>
    </Fragment>
  )
}

export default IndexPage
