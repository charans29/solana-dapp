import React from 'react'

function LeftCard() {
  return (
    <div className='w-2/3 flex flex-col justify-between items-center'>
    <div className='border-[1px] border-[#323035] rounded-md h-1/2 w-full'>

    </div>
    <div className='h-auto rounded-lg items-center text-center'>
        <p className='border-[0.5px] border-[#9176FED7] bg-[#14121F] rounded-md text-[#1FD8A4] cursor-pointer font-thin text-lg'>
            mint NFT
        </p>
        <text className="text-[#7B7B7B] font-extralight text-xs">
          ON-CHAIN UR POST (ART)
        </text>
    </div>
</div>
  )
}

export default LeftCard