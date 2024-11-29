import React from 'react'

interface FeedCardProps {
  userAsset: string[];
}

function FeedCard({ userAsset }: FeedCardProps) {
  return (
    <div className='border-[1px] border-[#323035] rounded-md h-full w-full overflow-auto'>
      {userAsset.length > 0 ? (
        <div>
          {userAsset.map((asset, index) => (
            <div key={index} className="flex flex-col p-2 space-y-1">
              <img
                src={asset} 
                alt={`Asset ${index + 1}`} 
                className="max-h-80 rounded-md border-[0.5px] border-[#313131] w-full object-top" 
              />
              <div className='flex flex-row space-x-1 justify-start text-[#313131] items-center'>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 mr-1'>
                  <path d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 
                    2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 
                    6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 
                    13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 
                    13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" 
                    fill="while" fillRule="evenodd" clipRule="evenodd"></path></svg>0
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#7B7B7B]">No assets found. Upload some NFTs.</p>
      )}
    </div>
  )
}

export default FeedCard