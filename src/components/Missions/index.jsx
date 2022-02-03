import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { request } from 'graphql-request';
import { Pagination } from 'antd';
import { endpoint, getMissions, missionsLength } from '../../graphql/spaceX';
import MissionCard from './MissionCard';
import Loading from '../Loading';

export default function Missions() {
  const [data, setData] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(5);
  const [dataLength, setDataLength] = useState(0);

  const getData = () => {
    const variables = {
      offset: pageNumber * numberOfPages,
      limit: (pageNumber * numberOfPages) + numberOfPages,
    };
    request(endpoint, getMissions, variables).then((response) => setData(
      response.missionsResult.data.map((e, index) => ({
        key: index,
        name: e.name,
        description: e.description,
        twitter: e.twitter,
        website: e.website,
        wikipedia: e.wikipedia,
        manufacturers: e.manufacturers,
        payloads: e.payloads.filter((x) => x),
      })),
    ));
  };

  const getDataLength = () => {
    request(endpoint, missionsLength).then((res) => setDataLength(res.missionsResult.result.totalCount));
  };

  useEffect(() => {
    getDataLength();
    return () => {};
  }, []);

  useEffect(() => {
    getData();
    return () => {
    };
  }, [pageNumber, numberOfPages]);

  const dataMemo = useMemo(() => data?.map((mission, index) => (
    <MissionCard mission={mission} key={index} />
  )), [data, pageNumber, numberOfPages]);

  return !data ? <Loading /> : (
    <div className="missionsContainer">
      {dataMemo}
      <div className="paginationBar">
        <Pagination
          size="small"
          total={dataLength}
          showSizeChanger
          pageSize={numberOfPages}
          pageSizeOptions={['5', '10', '20', '50']}
          onChange={(e) => setPageNumber(e - 1)}
          onShowSizeChange={(e, size) => setNumberOfPages(size)}
        />
      </div>
    </div>
  );
}
