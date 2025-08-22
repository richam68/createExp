import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  Hash,
  User,
  Building2,
  DollarSign,
  Calendar,
  Mail,
  Edit3,
} from "lucide-react";

const EmployeeTable = ({ employees, formatSalary, formatDate }) => {
  const columns = [
    {
      key: "id",
      header: "ID",
      icon: <Hash className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <Badge
          variant="outline"
          className="text-primary hover:bg-primary/10 text-xs px-2 py-1"
        >
          {emp.id}
        </Badge>
      ),
    },
    {
      key: "employee_name",
      header: "Employee Name",
      icon: <User className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => <span className="font-medium">{emp.employee_name}</span>,
    },
    {
      key: "employeeType",
      header: "Employee Type",
      icon: <Building2 className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <Badge
          variant={emp.employeeType === "Company" ? "default" : "secondary"}
          className={
            emp.employeeType === "Company"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs"
              : "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
          }
        >
          {emp.employeeType}
        </Badge>
      ),
    },
    {
      key: "employee_salary",
      header: "Salary",
      icon: (
        <DollarSign className="h-4 w-4 inline text-muted-foreground ml-1" />
      ),
      render: (emp) => (
        <span className="text-muted-foreground text-sm">
          {formatSalary(emp.employee_salary)}
        </span>
      ),
    },
    {
      key: "employee_age",
      header: "Age",
      icon: <Calendar className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <span className="text-muted-foreground text-sm">
          {emp.employee_age ? `${emp.employee_age} years` : "N/A"}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      icon: <Mail className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm truncate">{emp.email}</span>
          {/* <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div> */}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      icon: <Calendar className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(emp.createdAt)}
        </span>
      ),
    },
    {
      key: "updatedBy",
      header: "Updated By",
      icon: <Edit3 className="h-4 w-4 inline text-muted-foreground ml-1" />,
      render: (emp) => (
        <span className="text-muted-foreground text-sm">{emp.updatedBy}</span>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              {columns?.map(({ key, header, icon }) => (
                <TableHead key={key} className="whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {icon}
                    <span>{header}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/30">
                <TableCell>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                {columns?.map((col) => (
                  <TableCell key={col?.key}>{col.render(employee)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTable;
