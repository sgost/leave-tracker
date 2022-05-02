import React, { Fragment, useEffect, useState } from "react"

import { Card, Col, Row, Badge, Input } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, HeartOutlined, HeartTwoTone } from '@ant-design/icons';

import { SearchSection, NavSection } from "../components/pannel/styles";
import { CardsSection } from "../components/cards/styles";


import SEO from "../components/seo"

const IndexPage = () => {
  const [charData, setCharData] = useState();
  const [tabs, setTabs] = useState('Character');

  const [selChar, setSelChar] = useState();

  const ApiSelection = tabs === 'Character' ? 'character' : tabs === 'Location' ? "location" : tabs === 'Episode' ? "episode" : "";

  console.log('https://rickandmortyapi.com/api/character/Rick')


  const Search = (e) => {
    fetchMovies(e.target.value)
  }

  useEffect(() => {
    fetchMovies()
  }, [tabs])


  async function fetchMovies(value) {
    const response = await fetch('https://rickandmortyapi.com/api/character/?species=' + value);
    const result = await response.json()
    setCharData(result);
  }


  //Add Fav

  const addFav = (name, image, species, gender) => {
    console.log("ss")
    let user_records = new Array();
    user_records = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];
    user_records.push({
      "name": name,
      "image": image,
      "species": species,
      "gender": gender
    })
    localStorage.setItem("users", JSON.stringify(user_records))
  }

  const localData = JSON.parse(localStorage.getItem("users"))

  console.log(localData.name)




  return (
    <Fragment>
      <SEO title="Rick And Morty" description="Gatsby is a React-based open source framework with performance, scalability and security built-in." keywords={['gatsby', 'react']} />
      <NavSection>
        <img src='https://i.dlpng.com/static/png/6975728_preview.png' id="logo" onClick={() => setTabs('Character')} />
        <div id="nav_tabs">
          <p onClick={() => setTabs('Character')} className={tabs === 'Character' ? "active" : ""} role="presentation">Character</p>
          <p onClick={() => setTabs('Location')} className={tabs === 'Location' ? "active" : ""} role="presentation">Location</p>
          <p onClick={() => setTabs('Episode')} className={tabs === 'Episode' ? "active" : ""} role="presentation">Episode</p>
        </div>
      </NavSection>

      <SearchSection>
        <input type="search" placeholder="search" style={{ width: `100%`, outline: `none` }} onChange={(e) => Search(e)} />
        <div id="filters">
          <p onClick={() => setSelChar()}>All</p>
          <p onClick={() => setSelChar('Alive')}>Alive</p>
          <p onClick={() => setSelChar('Dead')}>Dead</p>
          <p onClick={() => setSelChar('Male')}>Male</p>
          <p onClick={() => setSelChar('Human')}>Human</p>
          <p onClick={() => setSelChar('Alien')}>Alien</p>
        </div>


      </SearchSection>
      <CardsSection >
        <Row gutter={[32, 52]}>
          {charData?.results.map((item, i) =>
            <>
              {selChar ?
                <>
                  {item.status === selChar || item.gender === selChar || item.species === selChar
                    ?
                    <Col span={8}>
                      <Badge.Ribbon text={item.status ? item.status : 'unknown'} style={{ background: item.status === 'Alive' ? 'green' : item.status === 'Dead' ? "red" : item.status === 'unknown' ? "purple" : "" }}>
                        <Card bordered={false}
                          cover={
                            <img
                              alt={item.name}
                              src={item.image ? item.image : `https://www.pngkit.com/png/full/112-1128909_rick-and-morty-transparent-png-fondos-de-pantalla.png`}
                              style={{ borderRadius: `20px 20px 0 0` }}
                            />
                          }
                          id="card"
                        >
                          <div id="card_data">
                            <h2>{item.name}</h2>
                            <div id="detail_container">
                              <Badge count={item.species} style={{ background: item.species === 'Human' ? '#942dbd' : item.species === 'Alien' ? "#26825f" : "#7bbda3" }} />
                              <Badge count={item.gender} style={{ background: item.gender === 'Male' ? '#c3cc1f' : item.gender === 'Female' ? "#1fbbcc" : "", margin: `0 0 0 10px` }} />
                            </div>
                          </div>
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                    :
                    ""
                  }
                </>
                :
                <Col span={8}>
                  <Badge.Ribbon text={item.status ? item.status : 'unknown'} style={{ background: item.status === 'Alive' ? 'green' : item.status === 'Dead' ? "red" : item.status === 'unknown' ? "purple" : "" }}>
                    <Card bordered={false}
                      cover={
                        <img
                          alt={item.name}
                          src={item.image ? item.image : `https://www.pngkit.com/png/full/112-1128909_rick-and-morty-transparent-png-fondos-de-pantalla.png`}
                          style={{ borderRadius: `20px 20px 0 0` }}
                        />
                      }
                      id="card">
                      <div id="card_data">
                        <h2>{item.name}</h2>
                        <div id="detail_container">
                          <Badge count={item.species} style={{ background: item.species === 'Human' ? '#942dbd' : item.species === 'Alien' ? "#26825f" : "#7bbda3" }} />
                          <Badge count={item.gender} style={{ background: item.gender === 'Male' ? '#c3cc1f' : item.gender === 'Female' ? "#1fbbcc" : "", margin: `0 0 0 10px` }} />
                        </div>
                        <HeartOutlined onClick={() => addFav(item.name, item.image, item.species, item.gender)} />
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              }
            </>
          )}
        </Row>
      </CardsSection>
    </Fragment>
  )
}

export default IndexPage
