import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SearchIcon,
  PlusIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive" | "pending"
  tags: string[]
  createdAt: string
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    phone: "138-0000-0001",
    company: "科技有限公司",
    status: "active",
    tags: ["VIP", "长期客户"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    phone: "138-0000-0002",
    company: "创新企业",
    status: "active",
    tags: ["新客户"],
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    phone: "138-0000-0003",
    company: "贸易公司",
    status: "inactive",
    tags: ["潜在客户"],
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    phone: "138-0000-0004",
    company: "咨询服务",
    status: "pending",
    tags: ["待跟进"],
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    phone: "138-0000-0005",
    company: "设计工作室",
    status: "active",
    tags: ["VIP", "合作伙伴"],
    createdAt: "2024-04-12",
  },
]

const statusMap = {
  active: { label: "活跃", variant: "default" as const },
  inactive: { label: "停用", variant: "secondary" as const },
  pending: { label: "待审核", variant: "outline" as const },
}

export function CRMPage() {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)
  const [viewingCustomer, setViewingCustomer] = React.useState<Customer | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const handleSaveCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCustomer: Customer = {
      id: editingCustomer?.id || String(Date.now()),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      status: (formData.get("status") as Customer["status"]) || "active",
      tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()) || [],
      createdAt: editingCustomer?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? newCustomer : c)))
    } else {
      setCustomers([...customers, newCustomer])
    }
    setIsDialogOpen(false)
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-svh bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">客户管理</h1>
            <p className="text-muted-foreground">管理您的客户信息，跟踪客户关系</p>
          </div>
          <Button onClick={handleAddCustomer}>
            <PlusIcon data-icon="inline-start" />
            添加客户
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>总客户数</CardDescription>
              <CardTitle className="text-3xl">{customers.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>活跃客户</CardDescription>
              <CardTitle className="text-3xl">
                {customers.filter((c) => c.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>待审核</CardDescription>
              <CardTitle className="text-3xl">
                {customers.filter((c) => c.status === "pending").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>VIP客户</CardDescription>
              <CardTitle className="text-3xl">
                {customers.filter((c) => c.tags.includes("VIP")).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索客户姓名、邮箱或公司..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card>
          <CardHeader>
            <CardTitle>客户列表</CardTitle>
            <CardDescription>
              共 {filteredCustomers.length} 位客户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户</TableHead>
                  <TableHead>联系方式</TableHead>
                  <TableHead>公司</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>标签</TableHead>
                  <TableHead>创建日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="size-3.5 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="size-3.5 text-muted-foreground" />
                        {customer.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[customer.status].variant}>
                        {statusMap[customer.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                            <EyeIcon className="mr-2 size-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            <EditIcon className="mr-2 size-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-destructive"
                          >
                            <TrashIcon className="mr-2 size-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSaveCustomer}>
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "编辑客户" : "添加客户"}
                </DialogTitle>
                <DialogDescription>
                  {editingCustomer
                    ? "修改客户信息，点击保存完成更新"
                    : "填写客户信息，点击保存添加到系统"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    姓名
                  </label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingCustomer?.name}
                    placeholder="输入客户姓名"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    邮箱
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingCustomer?.email}
                    placeholder="输入邮箱地址"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    电话
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingCustomer?.phone}
                    placeholder="输入联系电话"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    公司
                  </label>
                  <Input
                    id="company"
                    name="company"
                    defaultValue={editingCustomer?.company}
                    placeholder="输入公司名称"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    状态
                  </label>
                  <Select
                    name="status"
                    defaultValue={editingCustomer?.status || "active"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="inactive">停用</SelectItem>
                      <SelectItem value="pending">待审核</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    标签
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={editingCustomer?.tags.join(", ")}
                    placeholder="输入标签，用逗号分隔"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Detail Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>客户详情</DialogTitle>
            </DialogHeader>
            {viewingCustomer && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(viewingCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{viewingCustomer.name}</h3>
                    <Badge variant={statusMap[viewingCustomer.status].variant}>
                      {statusMap[viewingCustomer.status].label}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">邮箱</div>
                      <div>{viewingCustomer.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">电话</div>
                      <div>{viewingCustomer.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BuildingIcon className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">公司</div>
                      <div>{viewingCustomer.company}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="mb-2 text-sm text-muted-foreground">标签</div>
                  <div className="flex flex-wrap gap-2">
                    {viewingCustomer.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-sm text-muted-foreground">创建日期</div>
                  <div>{viewingCustomer.createdAt}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CRMPage
