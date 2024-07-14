import { useEffect, useState } from "react";
import { callAPIFEDelToken, callAPIFEPostToken } from "../apis/service";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRecoilState } from "recoil";
import { jwtATom } from "../states/atom";
import { GetListView } from "../apis/apis";
import { formatDateString } from "../helpers/helper";

export const StatisticalChart = () => {
  const [searchValue, setSearch] = useState("last 5 days");
  const [staticView, setView] = useState([]);
  const [JWT, setJWT] = useRecoilState(jwtATom);
  const getView = () => {
    callAPIFEPostToken(JWT, GetListView, searchValue).then((res) => {
      let dataStatic = staticView;
      res.map((view) => {
        for (let i = 0; i < dataStatic.length; i++) {
          if (dataStatic[i].name == formatDateString(view.viewDate)) {
            dataStatic[i].count += 1;
            return;
          }
        }

        dataStatic = [
          ...dataStatic,
          { name: formatDateString(view.viewDate), count: 1 },
        ];
      });
      setView(dataStatic);
    });
  };

  useEffect(() => {
    getView();
  }, [searchValue]);

  return (
    <>
      <div className="text-black flex items-center">
        <div className="mr-2">Time range: </div>
        <select
        className="py-1 pr-5 border"
          onChange={(event) => setSearch(event.target.value)}
          value={searchValue}
        >
          <option>last 5 days</option>
          <option>last 30 days</option>
          <option>last month</option>
        </select>
      </div>
      <br />
      <div>
        <AreaChart
          width={876}
          height={300}
          data={staticView}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </>
  );
};
