import * as React from "react";
import { Link } from "react-router-dom";

export const StoriesCol = [
  { id: "title", label: "Tiêu đề", minWidth: 170 },
  { id: "author", label: "Tác giả", minWidth: 100 },
  { id: "category", label: "Thể loại", minWidth: 100 },
  {
    id: "description",
    label: "Mô tả",
    minWidth: 170,
  },
  {
    id: "chapers",
    label: "Chương",
    minWidth: 170,
    align: "right",
  },
];

export const AccountsCol = [
  { id: "email", label: "Email", minWidth: 170 },
  { id: "address", label: "Địa chỉ", minWidth: 100 },
  { id: "phone", label: "Điện thoại", minWidth: 100 },
  {
    id: "createdDate",
    label: "Ngày tạo",
    minWidth: 170,
  },

  {
    id: "accountBalance",
    label: "Số dư",
    minWidth: 170,
    align: "right",
  },
  {
    id: "isActive",
    label: "Hoạt động",
    minWidth: 170,
    align: "right",
    format: (v) => {
      return v ? (
        <div className="flex items-center">
          <div className="h-3 w-3 mr-2 rounded-full bg-green-500"></div> Active
        </div>
      ) : (
        <div className="flex">
          <div className="h-3 w-3 mr-2 rounded-full bg-red-500"></div> UnActive
        </div>
      );
    },
  },
];

export const ReviewCol = [
  { id: "story", label: "Truyện", minWidth: 170 },
  { id: "user", label: "Tài khoản", minWidth: 100 },
  { id: "content", label: "Bình luận", minWidth: 100 },
  {
    id: "createdDate",
    label: "Ngày bình luận",
    minWidth: 170,
  },
];

export const RateCol = [
  { id: "story", label: "Truyện", minWidth: 170 },
  { id: "account", label: "Tài khoản", minWidth: 100 },
  { id: "rate1", label: "Sao", minWidth: 100 },
];

export const CateCol = [
  { id: "id", label: "id", minWidth: 170 },
  { id: "name", label: "Thể loại", minWidth: 100 },
];

export function StickyHeadTable({
  columns = [],
  rows = [],
  onSearch = () => {},
  detailUrl,
  deleteFunc,
  deleteContent = "Delete",
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownRadio"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              Last 30 days
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdownRadio"
              className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              data-popper-reference-hidden=""
              data-popper-escaped=""
              data-popper-placement="top"
              style={{
                position: "absolute",
                inset: "auto auto 0px 0px",
                margin: "0px",
                transform: "translate3d(522.5px, 3847.5px, 0px)",
              }}
            >
              <ul
                className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownRadioButton"
              >
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="filter-radio-example-1"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="filter-radio-example-1"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Last day
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <label for="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              onChange={onSearch}
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {/* <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th> */}

              {columns.map((col) => (
                <th scope="col" className="px-6 py-3">
                  {col.label}
                </th>
              ))}
              <th scope="col" colSpan={2} className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((r) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {/* <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td> */}
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {r[columns[0].id]}
                </th>
                {columns.slice(1, columns.length).map((c) => (
                  <td className="px-6 py-4 h-10 overflow-y-hidden">
                    {c?.format ? c.format(r[c.id]) : r[c.id]}
                  </td>
                ))}
                {detailUrl ? (
                  <td className="px-6 py-4">
                    <Link
                      to={`${detailUrl}/${r.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                ) : (
                  <td></td>
                )}
                {deleteFunc ? (
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteFunc(r.id)}
                      className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                    >
                      {deleteContent}
                    </button>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
