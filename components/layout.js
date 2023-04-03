import NavigationCard from '@/components/navigationcard'




export default function Layout ({children,hideNav}) {
    return (
        <div className='flex mt-4 max-w-4xl mx-auto gap-6'>
            {!hideNav && (
        <div className='w-3/12'>
        <NavigationCard/>
        </div>
            )}
        <div className={hideNav ? 'w-full' : 'w-9/12'}>
        {children}
        </div>
      </div>
    )
}