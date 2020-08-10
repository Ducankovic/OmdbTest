import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Alert,
  Modal,
  Typography,
} from "antd";

import "antd/dist/antd.css";
import { Dropdown } from "antd";
import { Checkbox } from "antd";

const API_KEY = "ce762116";
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

const SearchBox = ({ searchHandler }) => {
  return (
    <React.Fragment>
      {" "}
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Search
              placeholder="unesite ime filma "
              enterButton="Pretrazi"
              size="large"
              onSearch={(value) => searchHandler(value)}
            />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

const ColCardBox = ({
  Title,
  Year,
  imdbID,
  Poster,
  Type,
  ShowDetail,
  DetailRequest,
  ActivateModal,
}) => {
  const clickHandler = () => {
    ActivateModal(true);
    DetailRequest(true);

    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then((resp) => resp)
      .then((resp) => resp.json())
      .then((response) => {
        DetailRequest(false);
        ShowDetail(response);
      })
      .catch(({ message }) => {
        DetailRequest(false);
      });
  };

  return (
    <Col style={{ margin: "20px 0" }} className="gutter-row" span={4}>
      <div className="gutter-box">
        <Card
          style={{ width: 200 }}
          cover={
            <img
              alt={Title}
              src={
                Poster === "N/A"
                  ? "https://tazacommune.com/wp-content/plugins/wp-appkit/default-themes/q-ios/img/img-icon.svg"
                  : Poster
              }
            />
          }
          onClick={() => clickHandler()}
        >
          <Meta title={Title} description={Year} />
          <Row style={{ marginTop: "22px" }} className="gutter-row">
            <Col>
              <Tag color="green">{Type}</Tag>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  );
};

const MovieDetail = ({
  Title,
  Poster,
  Actors,
  imdbRating,
  Rated,
  Runtime,
  Genre,
  Plot,
}) => {
  return (
    <Row>
      <Col span={11}>
        <img
          src={
            Poster === "N/A"
              ? "https://placehold.it/198x264&text=Image+Not+Found"
              : Poster
          }
          alt={Title}
        />
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle>
          </Col>
          <Col span={3} style={{ textAlign: "right" }}>
            <TextTitle level={4}>
              <span style={{ color: "#41A8F8" }}>{imdbRating}</span>
            </TextTitle>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
        </Row>
        <br />
        <Row>
          <Col>{Actors}</Col>
        </Row>
      </Col>
    </Row>
  );
};

const Loader = () => (
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <Spin />
  </div>
);

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState("titanic");
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`)
      .then((resp) => resp)
      .then((resp) => resp.json())
      .then((response) => {
        if (response.Response === "False") {
          setError(response.Error);
        } else {
          setData(response.Search);
        }

        setLoading(false);
      })
      .catch(({ message }) => {
        setError(message);
        setLoading(false);
      });
  }, [q]);

  return (
    <React.Fragment>
      <div className="App" style={{ color: "#cccccc", marginTop: "14px" }}>
        <Layout className="layout">
          <Header style={{ color: "#bbbbbb", marginTop: "14px" }}>
            <div style={{ textAlign: "center", color: "#cccc" }}>
              <TextTitle
                style={{ color: "#bbbbbb", marginTop: "14px" }}
                level={3}
              >
                OMDB
              </TextTitle>
            </div>
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
              <SearchBox searchHandler={setQuery} />
              <Checkbox />

              <br />

              <br />

              <Row gutter={16} type="flex" justify="center">
                {loading && <Loader />}
                {error !== null && (
                  <div style={{ margin: "20px 0" }}>
                    <Alert message={error} type="error" />
                  </div>
                )}

                {data !== null &&
                  data.length > 0 &&
                  data.map((result, index) => (
                    <ColCardBox
                      ShowDetail={setShowDetail}
                      DetailRequest={setDetailRequest}
                      ActivateModal={setActivateModal}
                      key={index}
                      {...result}
                    />
                  ))}
              </Row>
            </div>
            <Modal
              title="Detalji"
              centered
              visible={activateModal}
              onCancel={() => setActivateModal(false)}
              footer={null}
              width={800}
            >
              {detailRequest === false ? (
                <MovieDetail {...detail} />
              ) : (
                <Loader />
              )}
            </Modal>
          </Content>
          <Footer style={{ textAlign: "center" }}>TEST</Footer>
        </Layout>
      </div>
    </React.Fragment>
  );
}

export default App;
