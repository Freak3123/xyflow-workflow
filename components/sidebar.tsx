"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  nodeType: "conditionalSplit" | "email" | null
  nodeId: string | null
  onSave: (nodeId: string, config: any) => void
  initialData: any
}

interface Rule {
  id: string
  condition: string
  operator: string
  value: string
}

interface Group {
  id: string
  operator: "AND" | "OR"
  not: boolean
  rules: Rule[]
}

export function Sidebar({ isOpen, onClose, nodeType, nodeId, onSave, initialData }: SidebarProps) {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      operator: "AND",
      not: false,
      rules: [],
    },
  ])

  const [emailData, setEmailData] = useState({
    subject: "",
    senderEmail: "",
    description: "",
  })

  useEffect(() => {
    if (initialData) {
      if (nodeType === "email") {
        setEmailData(initialData)
      } else if (nodeType === "conditionalSplit") {
        setGroups(initialData.groups || [{ id: "1", operator: "AND", not: false, rules: [] }])
      }
    }
  }, [initialData, nodeType])

  const addRule = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: [
                ...group.rules,
                {
                  id: Date.now().toString(),
                  condition: "Has responded",
                  operator: "=",
                  value: "",
                },
              ],
            }
          : group,
      ),
    )
  }

  const removeRule = (groupId: string, ruleId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.filter((rule) => rule.id !== ruleId),
            }
          : group,
      ),
    )
  }

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: Date.now().toString(),
        operator: "AND",
        not: false,
        rules: [],
      },
    ])
  }

  const updateGroup = (groupId: string, updates: Partial<Group>) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, ...updates } : group)))
  }

  const updateRule = (groupId: string, ruleId: string, updates: Partial<Rule>) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
            }
          : group,
      ),
    )
  }

  const handleSave = () => {
    if (!nodeId) return

    if (nodeType === "email") {
      onSave(nodeId, emailData)
    } else if (nodeType === "conditionalSplit") {
      onSave(nodeId, { groups })
    }
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {nodeType === "conditionalSplit" ? "Conditional Split" : "Subject and sender"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {nodeType === "conditionalSplit" && (
            <>
              {groups.map((group, groupIndex) => (
                <Card key={group.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {groupIndex === 0 ? "Conditional split details" : `Group ${groupIndex + 1}`}
                    </CardTitle>
                    {groupIndex === 0 && (
                      <p className="text-xs text-gray-600">
                        Create a split in your flow based on a profile's properties or behavior.
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Select
                        value={group.operator}
                        onValueChange={(value: "AND" | "OR") => updateGroup(group.id, { operator: value })}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`not-${group.id}`}
                          checked={group.not}
                          onCheckedChange={(checked) => updateGroup(group.id, { not: !!checked })}
                        />
                        <Label htmlFor={`not-${group.id}`} className="text-sm">
                          Not
                        </Label>
                      </div>
                    </div>

                    {group.rules.map((rule) => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <Select
                          value={rule.condition}
                          onValueChange={(value) => updateRule(group.id, rule.id, { condition: value })}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Has responded">Has responded</SelectItem>
                            <SelectItem value="Has not responded">Has not responded</SelectItem>
                            <SelectItem value="Very interested">Very interested</SelectItem>
                            <SelectItem value="Part of list">Part of list</SelectItem>
                            <SelectItem value="Field">Field</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={rule.operator}
                          onValueChange={(value) => updateRule(group.id, rule.id, { operator: value })}
                        >
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="=">=</SelectItem>
                            <SelectItem value="in">in</SelectItem>
                            <SelectItem value="between">between</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          className="flex-1"
                          value={rule.value ?? ""}
                          onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                        />

                        <Button variant="ghost" size="sm" onClick={() => removeRule(group.id, rule.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => addRule(group.id)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Rule
                      </Button>
                      <Button variant="outline" size="sm" onClick={addGroup}>
                        <Plus className="w-4 h-4 mr-1" />
                        Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {nodeType === "email" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Subject and sender</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="subject"
                      value={emailData.subject ?? ""}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Variables
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sender" className="text-sm font-medium">
                    Sender Email
                  </Label>
                  <Input
                    id="sender"
                    value={emailData.senderEmail ?? ""}
                    onChange={(e) => setEmailData({ ...emailData, senderEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Variables
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={emailData.description}
                    onChange={(e) => setEmailData({ ...emailData, description: e.target.value })}
                    placeholder="Enter your description here..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t space-y-2">
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
            Save
          </Button>
          <Button variant="destructive" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
