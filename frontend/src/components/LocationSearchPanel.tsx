import React from 'react'

interface locationSearchPanelProps {
    setPanel: React.Dispatch<React.SetStateAction<boolean>>;
    setVehiclePanel: React.Dispatch<React.SetStateAction<boolean>>;
    pickupSuggestions: Array<string>;
    destinationSuggestions: Array<string>;
    setPickupSuggestions: React.Dispatch<React.SetStateAction<Array<string>>>;
    setDestinationSuggestions: React.Dispatch<React.SetStateAction<Array<string>>>;
    pickup: string;
    destination: string;
    setPickup: React.Dispatch<React.SetStateAction<string>>;
    setDestination: React.Dispatch<React.SetStateAction<string>>;
}

const LocationSearchPanel :React.FC<locationSearchPanelProps> = (props ) => {
  return (
    <div>
        {/* Show pickup suggestions when typing in pickup field */}
        {props.pickup.length >= 3 && (
          <div>
            <h3 className='text-sm font-semibold mb-2 px-3'>Pickup Suggestions:</h3>
            {props.pickupSuggestions && props.pickupSuggestions.length > 0 ? (
                props.pickupSuggestions.map((location, index) => (
                    <div 
                        onClick={() => {
                            props.setPickup(location);
                            props.setPickupSuggestions([]);
                        }} 
                        key={`pickup-${index}`} 
                        className='flex items-center justify-start cursor-pointer gap-4 border-2 p-3 rounded-xl active:border-black my-2 hover:border-gray-400'
                    >
                        <h2 className='bg-[#eee] h-10 w-10 flex rounded-full items-center justify-center'>
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className='font-medium'>{location}</h4>
                    </div>
                ))
            ) : (
                <div className='p-4 text-gray-500 text-center text-sm'>
                    Loading pickup suggestions...
                </div>
            )}
          </div>
        )}

        {/* Show destination suggestions when typing in destination field */}
        {props.destination.length >= 3 && (
          <div>
            <h3 className='text-sm font-semibold mb-2 px-3 mt-4'>Destination Suggestions:</h3>
            {props.destinationSuggestions && props.destinationSuggestions.length > 0 ? (
                props.destinationSuggestions.map((location, index) => (
                    <div 
                        onClick={() => {
                            props.setDestination(location);
                            props.setDestinationSuggestions([]);
                            props.setVehiclePanel(true);
                            props.setPanel(false);
                        }} 
                        key={`destination-${index}`} 
                        className='flex items-center justify-start cursor-pointer gap-4 border-2 p-3 rounded-xl active:border-black my-2 hover:border-gray-400'
                    >
                        <h2 className='bg-[#eee] h-10 w-10 flex rounded-full items-center justify-center'>
                            <i className="ri-map-pin-fill"></i>
                        </h2>
                        <h4 className='font-medium'>{location}</h4>
                    </div>
                ))
            ) : (
                <div className='p-4 text-gray-500 text-center text-sm'>
                    Loading destination suggestions...
                </div>
            )}
          </div>
        )}

        {/* Show initial message when neither field has enough characters */}
        {props.pickup.length < 3 && props.destination.length < 3 && (
            <div className='p-4 text-gray-500 text-center'>
                Type at least 3 characters to see suggestions...
            </div>
        )}
    </div> 
  )
}


export default LocationSearchPanel