import { useState } from 'react'
import { Drawer } from '../ui'
import useMediaQuery from '../hooks/useMediaQuery'
import DashboardHeader from './DashboardHeader'
import SidebarNavigation from './SidebarNavigation'
import styles from './AppShell.module.css'

// Breakpoint provisional (ver ui/Button/Button.module.css): por debajo de 1024px
// el sidebar pasa de columna fija a Drawer.
const DESKTOP_QUERY = '(min-width: 1024px)'

function AppShell({ children, trips, activeTripId, onSelectTrip, onCreateTrip, onCreateExpense, onDeleteTrip }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.shell}>
      {isDesktop && <SidebarNavigation />}

      {!isDesktop && (
        <Drawer
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          side="left"
          contentClassName={styles.sidebarDrawerContent}
        >
          <SidebarNavigation
            variant="drawer"
            onNavigate={() => setSidebarOpen(false)}
            onClose={() => setSidebarOpen(false)}
          />
        </Drawer>
      )}

      <div className={styles.main}>
        {/* pageContainer: mismo container horizontal para Header + contenido —
            ver AppShell.module.css para el porqué de este nivel específico. */}
        <div className={styles.pageContainer}>
          <DashboardHeader
            showMenuButton={!isDesktop}
            onMenuClick={() => setSidebarOpen(true)}
            trips={trips}
            activeTripId={activeTripId}
            onSelectTrip={onSelectTrip}
            onCreateTrip={onCreateTrip}
            onCreateExpense={onCreateExpense}
            onDeleteTrip={onDeleteTrip}
          />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AppShell
