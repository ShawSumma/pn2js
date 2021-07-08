ROOT=test
NEXT:=./build/$(shell date +%s)
NTH=1
BUILD_LAST:=$(shell cat builds.txt | tail -n $(NTH) | head -n 1)
SRCS=index compiler/cjs parser/keyword parser/lex parser/node parser/op parser/parse parser/prec parser/token

defualt: last

backup: .fake
	cp -r build ~/.pn2js-tmp

last: .fake
	rm -rf bootstrap
	mkdir -p bootstrap
	cp -r stage1 $(NEXT)
	$(MAKE) --no-print-directory full ROOT=$(BUILD_LAST) NEXT=$(NEXT)
	cp -r $(NEXT) bootstrap
	rm bootstrap/*/*.pn
	rm bootstrap/*/*/*.pn
	echo $(NEXT) >> builds.txt

full: $(SRCS)

$(SRCS): .fake
	node $(ROOT)/index.js $(NEXT)/$@.pn

.fake: