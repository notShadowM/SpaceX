import React, { useEffect, useMemo, useState } from 'react';
import './style.css';
import { request } from 'graphql-request';
import { Pagination } from 'antd';
import { endpoint, getMissions, MissionIds } from '../../graphql/spaceX';
import MissionCard from './MissionCard';
import Loading from '../Loading';

export default function Missions() {
  const [data, setData] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(5);

  const getData = () => {
    request(endpoint, getMissions).then((response) => setData(
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

  useEffect(() => {
    getData();
    return () => {
    };
  }, []);

  // const dataMemo = useMemo(() => (
  //   <div className="missionsContainer">
  //     {data?.map((mission, index) => (
  //       <MissionCard mission={mission} key={index} />
  //     ))}
  //   </div>
  // ));

  return !data ? <Loading /> : (
    <div className="missionsContainer">
      {data.slice(pageNumber * numberOfPages, (pageNumber * numberOfPages) + numberOfPages).map((mission, index) => (
        <MissionCard mission={mission} key={index} />
      ))}
      <div className="paginationBar">
        <Pagination
          size="small"
          total={data.length}
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
