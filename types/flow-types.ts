export interface TreeNode {
  id: string
  type: "start" | "conditionalSplit" | "email"
  data: { label: string }
  children?: TreeNode[]
  yesChild?: TreeNode
  noChild?: TreeNode
  emailConfig?: {
    subject: string
    senderEmail: string
    description: string
  }
  conditionalConfig?: {
    groups: Array<{
      id: string
      operator: "AND" | "OR"
      not: boolean
      rules: Array<{
        id: string
        condition: string
        operator: string
        value: string
      }>
    }>
  }
}

export interface ViewportState {
  x: number
  y: number
  zoom: number
}
