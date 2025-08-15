export type SignUpDTO = {
  userId: string
  userName: string
  password: string
  picture: string
  signUpType: 'common' | 'google'
}
