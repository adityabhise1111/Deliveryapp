import travis_kalanick from '../assets/travis_kalanick.jpeg'

import { useContext } from 'react'
import { CaptainDataContext, type Captain } from '../context/CaptainContext'

const CaptainPanel = () => {
  const captainContext = useContext(CaptainDataContext);
  const captain: Captain | null | undefined = captainContext?.captain;
  console.log('Captain data in CaptainPanel:', captain);

  return (
    <div>
      <div className='justify-between items-center flex'>
        <div className='justify-start items-center flex gap-3'>
          <img className='h-15 w-15  rounded-full object-cover' src={travis_kalanick} alt="" />
          <h4 className='text-lg font-medium'>
            {captain?.user?.fullName?.firstName || captain?.fullName?.firstName} {captain?.user?.fullName?.lastName || captain?.fullName?.lastName}
          </h4>
        </div>
        <div>
          <h4 className='text-xl font-semibold'>₹498.76</h4>
          <p className='text-lg font-medium text-gray-600'>Earned</p>
        </div>
      </div>
      <div className='flex justify-between mt-10 px-10 text-center gap-2 bg-gray-100 rounded-3xl border-radius p-5'>
        <div>
          <i className="text-2xl font-thin  ri-timer-2-line"></i>
          <h5 className='text-lg font-medium '>10.2 </h5>
          <p className='text-sm text-gray-600'>Hours Online</p>

        </div>
        <div>
          <i className="text-2xl font-thin  ri-speed-up-line"></i>
          <h5 className='text-lg font-medium '>10.2 </h5>
          <p className='text-sm text-gray-600'>Hours Online</p>
        </div>
        <div>
          <i className="text-2xl font-thin  ri-booklet-line"></i>
          <h5 className='text-lg font-medium '>10.2 </h5>
          <p className='text-sm text-gray-600 '>Hours Online</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainPanel