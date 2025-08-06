import QuantityInput from "../quantity-input"

const DesignerFooter = () => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div className="text-center">
          <p className="text-base text-gray-500 font-semibold mb-1">Quantity</p>
          <QuantityInput />
        </div>
        <div className="text-left mb-1">
          <p className="text-base text-gray-500 font-semibold mb-1">Unit cost</p>
          <p className="text-base font-semibold">$13.70</p>
        </div>
        <div className="text-left mb-1">
          <p className="text-base text-gray-500 font-semibold mb-1">Delivery</p>
          <p className="text-base font-semibold">12 Sept</p>
        </div>
      </div>
      <button className="w-full bg-black text-white py-3 rounded-2xl">
        Confirm Changes & Review
      </button>
    </div>
  )
}

export default DesignerFooter
