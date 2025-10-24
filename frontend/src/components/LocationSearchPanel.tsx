import React from 'react'

interface locationSearchPanelProps {
    setPanel: React.Dispatch<React.SetStateAction<boolean>>;
    setVehiclePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const LocationSearchPanel :React.FC<locationSearchPanelProps> = (props ) => {
    const locations = [
        "24B Baker Street, London",
        "221B Baker Street, London",
        "10 Downing Street, London",
        "1600 Pennsylvania Ave NW, Washington, DC"
        
    ];
  return (
    <div>
        {/* this is sample data */}
        {locations.map((location, index) => (
            <div onClick={()=>{
                props.setVehiclePanel(true);
                props.setPanel(false);
            }} key={index} className='flex items-center justify-start cursor-pointer gap-4 border-2 p-3 rounded-xl active:border-black my-2'>
                <h2 className='bg-[#eee] h-10 w-10 flex rounded-full items-center justify-center'>
                    <i className="ri-map-pin-fill"></i>
                </h2>
                <h4 className='font-medium'>{location}
                </h4>
            </div>
        ))}
    </div> 
  )
}


export default LocationSearchPanel