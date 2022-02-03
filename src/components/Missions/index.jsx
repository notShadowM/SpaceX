import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { request } from 'graphql-request';
import { Pagination } from 'antd';
import { endpoint, getMissions, missionsLength } from '../../graphql/spaceX';
import MissionCard from './MissionCard/MissionCard';
import Loading from '../Loading';

export default function Missions() {
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    numberOfPages: 5,
    dataLength: 0,
  });

  const setPaginationData = (object) => setPagination((prevState) => ({ ...prevState, ...object }));

  const getData = () => {
    const variables = {
      offset: pagination.pageNumber * pagination.numberOfPages,
      limit: pagination.numberOfPages,
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
    request(endpoint, missionsLength).then((res) => setPaginationData({ dataLength: res.missionsResult.result.totalCount }));
  };

  useEffect(() => {
    getDataLength();
    return () => {};
  }, []);

  useEffect(() => {
    getData();
    return () => {
    };
  }, [pagination.pageNumber, pagination.numberOfPages]);

  const dataMemo = useMemo(() => data?.map((mission, index) => (
    <MissionCard mission={mission} key={index} />
  )), [data, pagination.pageNumber, pagination.numberOfPages]);

  return !data ? <Loading /> : (
    <div className="missionsContainer">
      {dataMemo}
      <div className="paginationBar">
        <Pagination
          size="small"
          total={pagination.dataLength}
          showSizeChanger
          pageSize={pagination.numberOfPages}
          pageSizeOptions={['5', '10', '20', '50']}
          onChange={(e) => setPaginationData({ pageNumber: e - 1 })}
          onShowSizeChange={(e, size) => setPaginationData({ numberOfPages: size })}
        />
      </div>
    </div>
  );
}
