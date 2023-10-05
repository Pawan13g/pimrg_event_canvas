import React from 'react'

import {
    Menubar
} from "@/shared/components/ui/menubar"
import { Button } from '../ui/button'

const Header = () => {
    return (
        <Menubar className="border-b py-6 px-2 lg:px-4 justify-between">

            <div>
                <span className="font-bold text-2xl from-purple-600 to-pink-600 bg-gradient-to-r bg-clip-text text-transparent font-dancingScript">Event Canvas</span>
            </div>


            <div>
                <Button className='px-4' size="sm">Login</Button>
            </div>

        </Menubar>
    )
}

export default Header