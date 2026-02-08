// 标签页项
export interface TabItem {
  key: string
  title: string
  closable?: boolean
}

// 菜单项
export interface MenuItem {
  key: string
  icon?: string
  label: string
  children?: MenuItem[]
}

// 用户信息
export interface UserInfo {
  id: string
  name: string
  avatar?: string
  role: string
  department: string
}
