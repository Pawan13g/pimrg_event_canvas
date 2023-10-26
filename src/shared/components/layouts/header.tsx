import React from 'react'

import {
    Menubar
} from "@/shared/components/ui/menubar"
import { Button } from '../ui/button'
import Link from 'next/link'

const Header = () => {
    return (
        <Menubar className="border-b py-6 px-2 lg:px-4 justify-between">

            <div className='flex items-end'>
                <span className="font-bold text-purple-600 text-lg">EVENT</span>
                &nbsp;
                <span className='font-bold text-gray-600 text-end text-xs'>REPO</span>
            </div>


            <div>
                <Link href='/login'>
                    <Button className='px-4' size="sm">Login</Button>
                </Link>
            </div>

        </Menubar>
    )
}

export default Header