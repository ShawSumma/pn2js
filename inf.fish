set last 0
mkdir -p test
cp -r stage0 test/stage0
while true
    set next (math $last + 1)
    cp -r stage1 test/stage$next
    make ROOT=test/stage$last NEXT=test/stage$next
    if test $status
    else
        echo fail
        break
    end
    set last $next
end