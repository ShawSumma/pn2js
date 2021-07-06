set last 0
mkdir -p test
cp -r stage0 test/stage0
cp prelude.js ./test/prelude.js
for i in (seq 4)
    set next (math $last + 1)
    cp -r stage1 test/stage$next
    make ROOT=test/stage$last NEXT=test/stage$next
    set last $next
end