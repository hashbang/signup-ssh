test: lint server test-cov

server:
	@ $(ENV_VARS) ./node_modules/.bin/mocha -A --recursive $(MOCHA_OPTS)

lint:
	@ find . -name "*.js" \
		-not -path "./node_modules/*" \
		-not -path "./coverage/*" -print0 | \
		xargs -0 ./node_modules/eslint/bin/eslint.js

test-cov:
	@ $(ENV_VARS) node \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -A --recursive $(MOCHA_OPTS)

open-cov:
	open coverage/lcov-report/index.html


test-travis: lint
	@ $(ENV_VARS) \
		node \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- \
		--bail \
		-A --recursive $(MOCHA_OPTS)

	@ node node_modules/.bin/istanbul check-coverage \
		--statements 100 --functions 100 --branches 100 --lines 100

.PHONY: test lint test-cov open-cov test-travis
