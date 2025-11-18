import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useAuth } from "@/layouts/Root"

function LogoutButton({ className, ...props }) {
  const { logout } = useAuth()

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={logout}
      className={className}
      {...props}
    >
      <ApperIcon name="LogOut" size={16} />
      Logout
    </Button>
  )
}

export default LogoutButton