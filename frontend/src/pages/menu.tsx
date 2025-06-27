
const Menu: React.FC = () =>  {
  return (
    <div className="bg-gray-50 flex justify-center items-center  w-full">
      <div className="ant-card-body flex flex-col w-full max-w-5xl p-6 rounded shadow-lg">

        <div className="flex-1 p-6 max-w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
            <h2 className="text-3xl font-bold flex items-center gap-2 text-black mb-2">
            </h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="text-left p-1">Product</th>
                  <th className="text-left p-2">Product Name</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-5">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedCartItems.map((item: CartitemInterface, index: number) => (
                  <tr key={item.ID}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 w-full whitespace-normal">
                      {item.Product?.product_name || "No name"}
                    </td>
                    <td className="p-2">
                      {item.Product?.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-2 text-center">{item.Quantity}</td>
                    <td className="p-2">
                      {(item.Quantity! * (item.Product?.price || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold flex items-center gap-2 text-black">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 );
}
export default Menu;