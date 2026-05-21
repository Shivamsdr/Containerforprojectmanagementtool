$ErrorActionPreference = "Stop"

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Uri,
        [hashtable]$Body = @{},
        [string]$Token = ""
    )
    $Headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $Headers["x-auth-token"] = $Token }
    
    $Params = @{
        Uri = "http://localhost:5000/api$Uri"
        Method = $Method
        Headers = $Headers
    }
    if ($Method -ne "GET" -and $Method -ne "DELETE") {
        $Params.Body = ($Body | ConvertTo-Json -Depth 10)
    }

    try {
        return Invoke-RestMethod @Params
    } catch {
        Write-Host "Error calling $Uri" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        if ($_.Exception.Response) {
            $Stream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            Write-Host $Reader.ReadToEnd() -ForegroundColor Red
        }
        exit 1
    }
}

Write-Host "1. Registering/Logging in User..." -ForegroundColor Cyan
# Try login first, if fails then signup
$UserEmail = "testuser_$(Get-Random)@example.com"
$UserPassword = "password123"

$User = Invoke-Api -Method POST -Uri "/auth/signup" -Body @{
    name = "Test User"
    email = $UserEmail
    password = $UserPassword
}
Write-Host "User created/logged in. Token acquired." -ForegroundColor Green
$Token = $User.token

Write-Host "`n2. Creating Project..." -ForegroundColor Cyan
$Project = Invoke-Api -Method POST -Uri "/projects" -Token $Token -Body @{
    name = "Kanban Test Project"
    description = "Testing drag and drop"
}
$ProjectId = $Project._id
Write-Host "Project created: $($Project.name) ($ProjectId)" -ForegroundColor Green

Write-Host "`n3. Creating Tasks..." -ForegroundColor Cyan
$Task1 = Invoke-Api -Method POST -Uri "/tasks" -Token $Token -Body @{
    title = "Task 1"
    project = $ProjectId
    status = "todo"
}
$Task2 = Invoke-Api -Method POST -Uri "/tasks" -Token $Token -Body @{
    title = "Task 2"
    project = $ProjectId
    status = "todo"
}
$Task3 = Invoke-Api -Method POST -Uri "/tasks" -Token $Token -Body @{
    title = "Task 3"
    project = $ProjectId
    status = "todo"
}
Write-Host "Tasks created: $($Task1.title) (Order: $($Task1.order)), $($Task2.title) (Order: $($Task2.order)), $($Task3.title) (Order: $($Task3.order))" -ForegroundColor Green

Write-Host "`n4. Testing Reordering (Move Task 3 to Top - Order 0)..." -ForegroundColor Cyan
# Task 3 (Order 2) -> Order 0. Should shift Task 1 (0->1) and Task 2 (1->2).
$UpdatedTask3 = Invoke-Api -Method PUT -Uri "/tasks/$($Task3._id)" -Token $Token -Body @{
    newOrder = 0
}
Write-Host "Task 3 moved to order $($UpdatedTask3.order)" -ForegroundColor Green

Write-Host "`n5. Verifying Order..." -ForegroundColor Cyan
$Tasks = Invoke-Api -Method GET -Uri "/projects/$ProjectId/tasks" -Token $Token
$TodoTasks = $Tasks.todo

foreach ($t in $TodoTasks) {
    Write-Host "$($t.title): Order $($t.order)"
}

# Simple assertions
if ($TodoTasks[0].title -eq "Task 3" -and $TodoTasks[0].order -eq 0) { Write-Host "CHECK: Task 3 is first [PASS]" -ForegroundColor Green } else { Write-Host "CHECK: Task 3 is first [FAIL]" -ForegroundColor Red }
if ($TodoTasks[1].title -eq "Task 1" -and $TodoTasks[1].order -eq 1) { Write-Host "CHECK: Task 1 is second [PASS]" -ForegroundColor Green } else { Write-Host "CHECK: Task 1 is second [FAIL]" -ForegroundColor Red }
if ($TodoTasks[2].title -eq "Task 2" -and $TodoTasks[2].order -eq 2) { Write-Host "CHECK: Task 2 is third [PASS]" -ForegroundColor Green } else { Write-Host "CHECK: Task 2 is third [FAIL]" -ForegroundColor Red }

Write-Host "`n6. Testing Cross-Column Move (Task 3 -> Done)..." -ForegroundColor Cyan
$MovedTask = Invoke-Api -Method PUT -Uri "/tasks/$($Task3._id)" -Token $Token -Body @{
    status = "done"
}
Write-Host "Task 3 moved to Done." -ForegroundColor Green

Write-Host "`n7. Verifying Gap Close in Todo..." -ForegroundColor Cyan
$TasksAfterMove = Invoke-Api -Method GET -Uri "/projects/$ProjectId/tasks" -Token $Token
$TodoTasksAfter = $TasksAfterMove.todo

foreach ($t in $TodoTasksAfter) {
    Write-Host "$($t.title): Order $($t.order)"
}

# Task 1 was order 1, Task 2 was order 2. 
# Task 3 (order 0) was removed. 
# Logic: "Remove from old column -> Close Gap ... status: oldStatus, order: { $gt: oldOrder } ... $inc: -1"
# Wait, Task 3 was at order 0. So orders > 0 should decrement.
# Task 1 (1 -> 0), Task 2 (2 -> 1).

if ($TodoTasksAfter[0].title -eq "Task 1" -and $TodoTasksAfter[0].order -eq 0) { Write-Host "CHECK: Task 1 shifted to 0 [PASS]" -ForegroundColor Green } else { Write-Host "CHECK: Task 1 shifted to 0 [FAIL] - Actual: $($TodoTasksAfter[0].order)" -ForegroundColor Red }
if ($TodoTasksAfter[1].title -eq "Task 2" -and $TodoTasksAfter[1].order -eq 1) { Write-Host "CHECK: Task 2 shifted to 1 [PASS]" -ForegroundColor Green } else { Write-Host "CHECK: Task 2 shifted to 1 [FAIL] - Actual: $($TodoTasksAfter[1].order)" -ForegroundColor Red }

Write-Host "`nVerification Complete!"
