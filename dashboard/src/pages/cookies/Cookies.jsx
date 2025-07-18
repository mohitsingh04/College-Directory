// import React, { Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { API } from "../../services/API";
// import { useQuery } from "@tanstack/react-query";

// const fetchData = async () => {
//   const startTime = performance.now();

//   const { data } = await API.get("/fetch-city");

//   const endTime = performance.now(); 
//   const fetchTime = ((endTime - startTime) / 1000).toFixed(2); 

//   const responseSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
//   const fetchSize = (responseSizeInBytes / (1024 * 1024)).toFixed(2);

//   return { data, fetchTime, fetchSize };
// };

// const GetCookies = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["myData"],
//     queryFn: fetchData,
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <Fragment>
//       <Card className="custom-card mt-5">
//         <Card.Header>
//           <h3 className="card-title">Fetch Property</h3>
//         </Card.Header>
//         <Card.Body>
//           <p>Fetch Time: {data?.fetchTime} sec</p>
//           <p>Fetched Size: {data?.fetchSize} MB</p>
//           {data?.data?.length > 0 ? (
//             <div className="table">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Id</th>
//                     <th>City Name</th>
//                     <th>State Id</th>
//                     <th>State Code</th>
//                     <th>Country Id</th>
//                     <th>Country Code</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.data.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.id}</td>
//                       <td>{item.name}</td>
//                       <td>{item.state_id}</td>
//                       <td>{item.state_code}</td>
//                       <td>{item.country_id}</td>
//                       <td>{item.country_code}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No Property Found.</p>
//           )}
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// };

// export default GetCookies;

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Spinner } from "react-bootstrap";  // Bootstrap spinner
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { API } from "../../services/API";

export default function Cookies() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const fetchCitiesData = async () => {
      setLoading(true);
      try {
        const response = await API.get('/fetch-city');
        setCities(response?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesData();
  }, []);

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'state_name', header: 'State name' },
    { accessorKey: 'country_name', header: 'Country name' },
  ], []);

  const table = useReactTable({
    data: cities,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Fragment>
      <Card className="custom-card mt-5">
        <Card.Header>
          <h3 className="card-title">Tanstack Datatable</h3>
        </Card.Header>
        <Card.Body>
          <div className="p-4">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="border rounded p-2 mb-4 w-full"
              disabled={loading}
            />

            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <table className="min-w-full border border-gray-300">
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id} className="bg-gray-100">
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="border p-2 cursor-pointer select-none"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="border p-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="border px-3 py-1 mr-2 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="border px-3 py-1 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>

                  <div>
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
