import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export function ClubRootPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/client/club/member/1')
  }, [navigate])
  return null
}
