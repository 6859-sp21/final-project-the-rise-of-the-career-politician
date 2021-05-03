
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35737/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity$2 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element$2(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$2() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element$2('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity$2, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch$1(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch$1(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch$1(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/@sveltejs/svelte-scroller/Scroller.svelte generated by Svelte v3.37.0 */

    const { window: window_1 } = globals;
    const file$g = "node_modules/@sveltejs/svelte-scroller/Scroller.svelte";
    const get_foreground_slot_changes = dirty => ({});
    const get_foreground_slot_context = ctx => ({});
    const get_background_slot_changes = dirty => ({});
    const get_background_slot_context = ctx => ({});

    function create_fragment$g(ctx) {
    	let svelte_scroller_outer;
    	let svelte_scroller_background_container;
    	let svelte_scroller_background;
    	let t;
    	let svelte_scroller_foreground;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[20]);
    	const background_slot_template = /*#slots*/ ctx[19].background;
    	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[18], get_background_slot_context);
    	const foreground_slot_template = /*#slots*/ ctx[19].foreground;
    	const foreground_slot = create_slot(foreground_slot_template, ctx, /*$$scope*/ ctx[18], get_foreground_slot_context);

    	const block = {
    		c: function create() {
    			svelte_scroller_outer = element$2("svelte-scroller-outer");
    			svelte_scroller_background_container = element$2("svelte-scroller-background-container");
    			svelte_scroller_background = element$2("svelte-scroller-background");
    			if (background_slot) background_slot.c();
    			t = space();
    			svelte_scroller_foreground = element$2("svelte-scroller-foreground");
    			if (foreground_slot) foreground_slot.c();
    			set_custom_element_data(svelte_scroller_background, "class", "svelte-1p19dno");
    			add_location(svelte_scroller_background, file$g, 169, 2, 3916);
    			set_custom_element_data(svelte_scroller_background_container, "class", "background-container svelte-1p19dno");
    			set_custom_element_data(svelte_scroller_background_container, "style", /*style*/ ctx[4]);
    			add_location(svelte_scroller_background_container, file$g, 168, 1, 3838);
    			set_custom_element_data(svelte_scroller_foreground, "class", "svelte-1p19dno");
    			add_location(svelte_scroller_foreground, file$g, 174, 1, 4078);
    			set_custom_element_data(svelte_scroller_outer, "class", "svelte-1p19dno");
    			add_location(svelte_scroller_outer, file$g, 167, 0, 3795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_scroller_outer, anchor);
    			append_dev(svelte_scroller_outer, svelte_scroller_background_container);
    			append_dev(svelte_scroller_background_container, svelte_scroller_background);

    			if (background_slot) {
    				background_slot.m(svelte_scroller_background, null);
    			}

    			/*svelte_scroller_background_binding*/ ctx[21](svelte_scroller_background);
    			append_dev(svelte_scroller_outer, t);
    			append_dev(svelte_scroller_outer, svelte_scroller_foreground);

    			if (foreground_slot) {
    				foreground_slot.m(svelte_scroller_foreground, null);
    			}

    			/*svelte_scroller_foreground_binding*/ ctx[22](svelte_scroller_foreground);
    			/*svelte_scroller_outer_binding*/ ctx[23](svelte_scroller_outer);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (background_slot) {
    				if (background_slot.p && dirty[0] & /*$$scope*/ 262144) {
    					update_slot(background_slot, background_slot_template, ctx, /*$$scope*/ ctx[18], dirty, get_background_slot_changes, get_background_slot_context);
    				}
    			}

    			if (!current || dirty[0] & /*style*/ 16) {
    				set_custom_element_data(svelte_scroller_background_container, "style", /*style*/ ctx[4]);
    			}

    			if (foreground_slot) {
    				if (foreground_slot.p && dirty[0] & /*$$scope*/ 262144) {
    					update_slot(foreground_slot, foreground_slot_template, ctx, /*$$scope*/ ctx[18], dirty, get_foreground_slot_changes, get_foreground_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background_slot, local);
    			transition_in(foreground_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background_slot, local);
    			transition_out(foreground_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_scroller_outer);
    			if (background_slot) background_slot.d(detaching);
    			/*svelte_scroller_background_binding*/ ctx[21](null);
    			if (foreground_slot) foreground_slot.d(detaching);
    			/*svelte_scroller_foreground_binding*/ ctx[22](null);
    			/*svelte_scroller_outer_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const handlers = [];
    let manager;

    if (typeof window !== "undefined") {
    	const run_all = () => handlers.forEach(fn => fn());
    	window.addEventListener("scroll", run_all);
    	window.addEventListener("resize", run_all);
    }

    if (typeof IntersectionObserver !== "undefined") {
    	const map = new Map();

    	const observer = new IntersectionObserver((entries, observer) => {
    			entries.forEach(entry => {
    				const update = map.get(entry.target);
    				const index = handlers.indexOf(update);

    				if (entry.isIntersecting) {
    					if (index === -1) handlers.push(update);
    				} else {
    					update();
    					if (index !== -1) handlers.splice(index, 1);
    				}
    			});
    		},
    	{
    			rootMargin: "400px 0px", // TODO why 400?
    			
    		});

    	manager = {
    		add: ({ outer, update }) => {
    			const { top, bottom } = outer.getBoundingClientRect();
    			if (top < window.innerHeight && bottom > 0) handlers.push(update);
    			map.set(outer, update);
    			observer.observe(outer);
    		},
    		remove: ({ outer, update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    			map.delete(outer);
    			observer.unobserve(outer);
    		}
    	};
    } else {
    	manager = {
    		add: ({ update }) => {
    			handlers.push(update);
    		},
    		remove: ({ update }) => {
    			const index = handlers.indexOf(update);
    			if (index !== -1) handlers.splice(index, 1);
    		}
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let top_px;
    	let bottom_px;
    	let threshold_px;
    	let style;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Scroller", slots, ['background','foreground']);
    	let { top = 0 } = $$props;
    	let { bottom = 1 } = $$props;
    	let { threshold = 0.5 } = $$props;
    	let { query = "section" } = $$props;
    	let { parallax = false } = $$props;
    	let { index = 0 } = $$props;
    	let { count = 0 } = $$props;
    	let { offset = 0 } = $$props;
    	let { progress = 0 } = $$props;
    	let { visible = false } = $$props;
    	let outer;
    	let foreground;
    	let background;
    	let left;
    	let sections;
    	let wh = 0;
    	let fixed;
    	let offset_top;
    	let width = 1;
    	let height;
    	let inverted;

    	onMount(() => {
    		sections = foreground.querySelectorAll(query);
    		$$invalidate(6, count = sections.length);
    		update();
    		const scroller = { outer, update };
    		manager.add(scroller);
    		return () => manager.remove(scroller);
    	});

    	function update() {
    		if (!foreground) return;

    		// re-measure outer container
    		const bcr = outer.getBoundingClientRect();

    		left = bcr.left;
    		$$invalidate(17, width = bcr.right - left);

    		// determine fix state
    		const fg = foreground.getBoundingClientRect();

    		const bg = background.getBoundingClientRect();
    		$$invalidate(9, visible = fg.top < wh && fg.bottom > 0);
    		const foreground_height = fg.bottom - fg.top;
    		const background_height = bg.bottom - bg.top;
    		const available_space = bottom_px - top_px;
    		$$invalidate(8, progress = (top_px - fg.top) / (foreground_height - available_space));

    		if (progress <= 0) {
    			$$invalidate(16, offset_top = 0);
    			$$invalidate(15, fixed = false);
    		} else if (progress >= 1) {
    			$$invalidate(16, offset_top = parallax
    			? foreground_height - background_height
    			: foreground_height - available_space);

    			$$invalidate(15, fixed = false);
    		} else {
    			$$invalidate(16, offset_top = parallax
    			? Math.round(top_px - progress * (background_height - available_space))
    			: top_px);

    			$$invalidate(15, fixed = true);
    		}

    		for ($$invalidate(5, index = 0); index < sections.length; $$invalidate(5, index += 1)) {
    			const section = sections[index];
    			const { top } = section.getBoundingClientRect();
    			const next = sections[index + 1];
    			const bottom = next ? next.getBoundingClientRect().top : fg.bottom;
    			$$invalidate(7, offset = (threshold_px - top) / (bottom - top));
    			if (bottom >= threshold_px) break;
    		}
    	}

    	const writable_props = [
    		"top",
    		"bottom",
    		"threshold",
    		"query",
    		"parallax",
    		"index",
    		"count",
    		"offset",
    		"progress",
    		"visible"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Scroller> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, wh = window_1.innerHeight);
    	}

    	function svelte_scroller_background_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	function svelte_scroller_foreground_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			foreground = $$value;
    			$$invalidate(2, foreground);
    		});
    	}

    	function svelte_scroller_outer_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			outer = $$value;
    			$$invalidate(1, outer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("top" in $$props) $$invalidate(10, top = $$props.top);
    		if ("bottom" in $$props) $$invalidate(11, bottom = $$props.bottom);
    		if ("threshold" in $$props) $$invalidate(12, threshold = $$props.threshold);
    		if ("query" in $$props) $$invalidate(13, query = $$props.query);
    		if ("parallax" in $$props) $$invalidate(14, parallax = $$props.parallax);
    		if ("index" in $$props) $$invalidate(5, index = $$props.index);
    		if ("count" in $$props) $$invalidate(6, count = $$props.count);
    		if ("offset" in $$props) $$invalidate(7, offset = $$props.offset);
    		if ("progress" in $$props) $$invalidate(8, progress = $$props.progress);
    		if ("visible" in $$props) $$invalidate(9, visible = $$props.visible);
    		if ("$$scope" in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		handlers,
    		manager,
    		onMount,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		outer,
    		foreground,
    		background,
    		left,
    		sections,
    		wh,
    		fixed,
    		offset_top,
    		width,
    		height,
    		inverted,
    		update,
    		top_px,
    		bottom_px,
    		threshold_px,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("top" in $$props) $$invalidate(10, top = $$props.top);
    		if ("bottom" in $$props) $$invalidate(11, bottom = $$props.bottom);
    		if ("threshold" in $$props) $$invalidate(12, threshold = $$props.threshold);
    		if ("query" in $$props) $$invalidate(13, query = $$props.query);
    		if ("parallax" in $$props) $$invalidate(14, parallax = $$props.parallax);
    		if ("index" in $$props) $$invalidate(5, index = $$props.index);
    		if ("count" in $$props) $$invalidate(6, count = $$props.count);
    		if ("offset" in $$props) $$invalidate(7, offset = $$props.offset);
    		if ("progress" in $$props) $$invalidate(8, progress = $$props.progress);
    		if ("visible" in $$props) $$invalidate(9, visible = $$props.visible);
    		if ("outer" in $$props) $$invalidate(1, outer = $$props.outer);
    		if ("foreground" in $$props) $$invalidate(2, foreground = $$props.foreground);
    		if ("background" in $$props) $$invalidate(3, background = $$props.background);
    		if ("left" in $$props) left = $$props.left;
    		if ("sections" in $$props) sections = $$props.sections;
    		if ("wh" in $$props) $$invalidate(0, wh = $$props.wh);
    		if ("fixed" in $$props) $$invalidate(15, fixed = $$props.fixed);
    		if ("offset_top" in $$props) $$invalidate(16, offset_top = $$props.offset_top);
    		if ("width" in $$props) $$invalidate(17, width = $$props.width);
    		if ("height" in $$props) height = $$props.height;
    		if ("inverted" in $$props) $$invalidate(30, inverted = $$props.inverted);
    		if ("top_px" in $$props) top_px = $$props.top_px;
    		if ("bottom_px" in $$props) bottom_px = $$props.bottom_px;
    		if ("threshold_px" in $$props) threshold_px = $$props.threshold_px;
    		if ("style" in $$props) $$invalidate(4, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*top, wh*/ 1025) {
    			top_px = Math.round(top * wh);
    		}

    		if ($$self.$$.dirty[0] & /*bottom, wh*/ 2049) {
    			bottom_px = Math.round(bottom * wh);
    		}

    		if ($$self.$$.dirty[0] & /*threshold, wh*/ 4097) {
    			threshold_px = Math.round(threshold * wh);
    		}

    		if ($$self.$$.dirty[0] & /*top, bottom, threshold, parallax*/ 23552) {
    			(update());
    		}

    		if ($$self.$$.dirty[0] & /*fixed, offset_top, width*/ 229376) {
    			$$invalidate(4, style = `
		position: ${fixed ? "fixed" : "absolute"};
		top: 0;
		transform: translate(0, ${offset_top}px);
		width: ${width}px;
		z-index: ${inverted ? 3 : 1};
	`);
    		}
    	};

    	return [
    		wh,
    		outer,
    		foreground,
    		background,
    		style,
    		index,
    		count,
    		offset,
    		progress,
    		visible,
    		top,
    		bottom,
    		threshold,
    		query,
    		parallax,
    		fixed,
    		offset_top,
    		width,
    		$$scope,
    		slots,
    		onwindowresize,
    		svelte_scroller_background_binding,
    		svelte_scroller_foreground_binding,
    		svelte_scroller_outer_binding
    	];
    }

    class Scroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				top: 10,
    				bottom: 11,
    				threshold: 12,
    				query: 13,
    				parallax: 14,
    				index: 5,
    				count: 6,
    				offset: 7,
    				progress: 8,
    				visible: 9
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scroller",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get top() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get query() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parallax() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parallax(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity$2 } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        const len = node.getTotalLength();
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /* src/Bubble.svelte generated by Svelte v3.37.0 */
    const file$f = "src/Bubble.svelte";

    function create_fragment$f(ctx) {
    	let g;
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;
    	let text_1;
    	let t_value = /*d*/ ctx[0].data[/*displayVar*/ ctx[1]] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let g_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			circle = svg_element("circle");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(circle, "cx", circle_cx_value = /*d*/ ctx[0].x);
    			attr_dev(circle, "cy", circle_cy_value = /*d*/ ctx[0].y);
    			attr_dev(circle, "r", circle_r_value = /*d*/ ctx[0].r);

    			attr_dev(circle, "fill", circle_fill_value = /*colorDict*/ ctx[2][/*d*/ ctx[0].data.party]
    			? /*colorDict*/ ctx[2][/*d*/ ctx[0].data.party]
    			: "green");

    			add_location(circle, file$f, 33, 4, 775);
    			attr_dev(text_1, "x", text_1_x_value = /*d*/ ctx[0].x);
    			attr_dev(text_1, "y", text_1_y_value = /*d*/ ctx[0].y + 0.2 * /*d*/ ctx[0].r);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "class", "bubble-text svelte-1jktbz5");
    			add_location(text_1, file$f, 45, 4, 1054);
    			add_location(g, file$f, 27, 0, 659);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, circle);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "mouseover", /*sendInfo*/ ctx[3], false, false, false),
    					listen_dev(g, "mouseout", /*sendInfo*/ ctx[3], false, false, false),
    					listen_dev(g, "mousemove", /*sendInfo*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*d*/ 1 && circle_cx_value !== (circle_cx_value = /*d*/ ctx[0].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (!current || dirty & /*d*/ 1 && circle_cy_value !== (circle_cy_value = /*d*/ ctx[0].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (!current || dirty & /*d*/ 1 && circle_r_value !== (circle_r_value = /*d*/ ctx[0].r)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (!current || dirty & /*d*/ 1 && circle_fill_value !== (circle_fill_value = /*colorDict*/ ctx[2][/*d*/ ctx[0].data.party]
    			? /*colorDict*/ ctx[2][/*d*/ ctx[0].data.party]
    			: "green")) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if ((!current || dirty & /*d, displayVar*/ 3) && t_value !== (t_value = /*d*/ ctx[0].data[/*displayVar*/ ctx[1]] + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*d*/ 1 && text_1_x_value !== (text_1_x_value = /*d*/ ctx[0].x)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (!current || dirty & /*d*/ 1 && text_1_y_value !== (text_1_y_value = /*d*/ ctx[0].y + 0.2 * /*d*/ ctx[0].r)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!g_transition) g_transition = create_bidirectional_transition(g, fade, {}, true);
    				g_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!g_transition) g_transition = create_bidirectional_transition(g, fade, {}, false);
    			g_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (detaching && g_transition) g_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Bubble", slots, []);
    	let { d } = $$props;
    	let { displayVar } = $$props;
    	let name;
    	const colorDict = { "Republican": "red", "Democrat": "blue" };
    	const dispatch = createEventDispatcher();

    	function sendInfo(event) {
    		dispatch(event.type, { text: "Hi there", event, data: d });
    	}

    	
    	const writable_props = ["d", "displayVar"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Bubble> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("d" in $$props) $$invalidate(0, d = $$props.d);
    		if ("displayVar" in $$props) $$invalidate(1, displayVar = $$props.displayVar);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		fade,
    		d,
    		displayVar,
    		name,
    		colorDict,
    		dispatch,
    		sendInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ("d" in $$props) $$invalidate(0, d = $$props.d);
    		if ("displayVar" in $$props) $$invalidate(1, displayVar = $$props.displayVar);
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*d, name*/ 17) {
    			{
    				$$invalidate(4, name = d.data.official_full);
    				if (name === undefined || name === "unknown") $$invalidate(4, name = d.data.wikipedia);
    			}
    		}
    	};

    	return [d, displayVar, colorDict, sendInfo, name];
    }

    class Bubble extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { d: 0, displayVar: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bubble",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*d*/ ctx[0] === undefined && !("d" in props)) {
    			console.warn("<Bubble> was created without expected prop 'd'");
    		}

    		if (/*displayVar*/ ctx[1] === undefined && !("displayVar" in props)) {
    			console.warn("<Bubble> was created without expected prop 'displayVar'");
    		}
    	}

    	get d() {
    		throw new Error("<Bubble>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set d(value) {
    		throw new Error("<Bubble>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayVar() {
    		throw new Error("<Bubble>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayVar(value) {
    		throw new Error("<Bubble>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

    }

    function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
    var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(s.substring(i-64, i)));
    }
    s = s.substring(i-64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i=0; i<s.length; i++)
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
    tail[i>>2] |= 0x80 << ((i%4) << 3);
    if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
    }
    tail[14] = n*8;
    md5cycle(state, tail);
    return state;
    }

    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i)
    + (s.charCodeAt(i+1) << 8)
    + (s.charCodeAt(i+2) << 16)
    + (s.charCodeAt(i+3) << 24);
    }
    return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n)
    {
    var s='', j=0;
    for(; j<4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
    + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
    }

    function hex$1(x) {
    for (var i=0; i<x.length; i++)
    x[i] = rhex(x[i]);
    return x.join('');
    }

    function md5(s) {
    return hex$1(md51(s));
    }

    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */

    function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
    }

    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') ;

    /* src/WikipediaToolTip.svelte generated by Svelte v3.37.0 */

    const { console: console_1$5 } = globals;
    const file$e = "src/WikipediaToolTip.svelte";

    // (38:1) {:catch error}
    function create_catch_block$1(ctx) {
    	let t_value = console.log(/*error*/ ctx[7]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 8 && t_value !== (t_value = console.log(/*error*/ ctx[7]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(38:1) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (36:1) {:then image}
    function create_then_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element$2("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "here");
    			attr_dev(img, "width", "100");
    			attr_dev(img, "height", "100");
    			add_location(img, file$e, 36, 2, 1175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 8 && img.src !== (img_src_value = /*image*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(36:1) {:then image}",
    		ctx
    	});

    	return block;
    }

    // (34:15)    <p>Loading image</p>  {:then image}
    function create_pending_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element$2("p");
    			p.textContent = "Loading image";
    			add_location(p, file$e, 34, 2, 1137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(34:15)    <p>Loading image</p>  {:then image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let promise;
    	let t0;
    	let h4;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t8;
    	let li2;
    	let t11;
    	let li3;
    	let t14;
    	let li4;
    	let t17;
    	let li5;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 3,
    		error: 7
    	};

    	handle_promise(promise = /*image*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			info.block.c();
    			t0 = space();
    			h4 = element$2("h4");
    			t1 = text(/*name*/ ctx[2]);
    			t2 = space();
    			ul = element$2("ul");
    			li0 = element$2("li");
    			li0.textContent = `Year: ${/*data*/ ctx[4].year}`;
    			t5 = space();
    			li1 = element$2("li");
    			li1.textContent = `Age: ${/*data*/ ctx[4].age}`;
    			t8 = space();
    			li2 = element$2("li");
    			li2.textContent = `Total Time Served: ${/*data*/ ctx[4].cumulative_time_sen_and_house}`;
    			t11 = space();
    			li3 = element$2("li");
    			li3.textContent = `Party: ${/*data*/ ctx[4].party}`;
    			t14 = space();
    			li4 = element$2("li");

    			li4.textContent = `Position: ${/*data*/ ctx[4].type === "sen"
			? "Senator"
			: "Representative"}`;

    			t17 = space();
    			li5 = element$2("li");
    			li5.textContent = `State: ${/*data*/ ctx[4].state}`;
    			add_location(h4, file$e, 40, 1, 1280);
    			add_location(li0, file$e, 42, 2, 1304);
    			add_location(li1, file$e, 43, 2, 1333);
    			add_location(li2, file$e, 44, 2, 1360);
    			add_location(li3, file$e, 45, 2, 1427);
    			add_location(li4, file$e, 46, 2, 1458);
    			add_location(li5, file$e, 47, 2, 1532);
    			add_location(ul, file$e, 41, 1, 1297);
    			set_style(div, "top", /*y*/ ctx[1] + "px");
    			set_style(div, "left", /*x*/ ctx[0] + "px");
    			attr_dev(div, "class", "tooltip svelte-5jekx0");
    			add_location(div, file$e, 32, 0, 1064);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = t0;
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(h4, t1);
    			append_dev(div, t2);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(ul, t8);
    			append_dev(ul, li2);
    			append_dev(ul, t11);
    			append_dev(ul, li3);
    			append_dev(ul, t14);
    			append_dev(ul, li4);
    			append_dev(ul, t17);
    			append_dev(ul, li5);
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*image*/ 8 && promise !== (promise = /*image*/ ctx[3]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[3] = child_ctx[7] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (dirty & /*name*/ 4) set_data_dev(t1, /*name*/ ctx[2]);

    			if (dirty & /*y*/ 2) {
    				set_style(div, "top", /*y*/ ctx[1] + "px");
    			}

    			if (dirty & /*x*/ 1) {
    				set_style(div, "left", /*x*/ ctx[0] + "px");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WikipediaToolTip", slots, []);
    	let { message } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let image;
    	let data = message.detail.data.data;
    	let name = data.official_full;
    	if (name === undefined || name === "unknown") name = data.wikipedia;

    	function getWikiPhoto() {
    		// https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api
    		const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims` + `&property=P18&entity=${data.wikidata}&format=json&origin=*`;

    		let promise = fetch(url).then(response => response.json()).then(data => {
    			const pictureName = data.claims.P18[0].mainsnak.datavalue.value.replaceAll(" ", "_");
    			const md5sum = md5(pictureName);

    			// console.log('picture name', pictureName, 'md5', md5sum)
    			const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5sum[0]}/${md5sum.slice(0, 2)}/${pictureName}`;

    			// console.log(imageUrl)
    			return imageUrl;
    		});

    		return promise;
    	}

    	image = getWikiPhoto();
    	const writable_props = ["message", "x", "y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<WikipediaToolTip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("message" in $$props) $$invalidate(5, message = $$props.message);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    	};

    	$$self.$capture_state = () => ({
    		md5,
    		message,
    		x,
    		y,
    		image,
    		data,
    		name,
    		getWikiPhoto
    	});

    	$$self.$inject_state = $$props => {
    		if ("message" in $$props) $$invalidate(5, message = $$props.message);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("image" in $$props) $$invalidate(3, image = $$props.image);
    		if ("data" in $$props) $$invalidate(4, data = $$props.data);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [x, y, name, image, data, message];
    }

    class WikipediaToolTip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { message: 5, x: 0, y: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WikipediaToolTip",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[5] === undefined && !("message" in props)) {
    			console_1$5.warn("<WikipediaToolTip> was created without expected prop 'message'");
    		}

    		if (/*x*/ ctx[0] === undefined && !("x" in props)) {
    			console_1$5.warn("<WikipediaToolTip> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[1] === undefined && !("y" in props)) {
    			console_1$5.warn("<WikipediaToolTip> was created without expected prop 'y'");
    		}
    	}

    	get message() {
    		throw new Error("<WikipediaToolTip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<WikipediaToolTip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<WikipediaToolTip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<WikipediaToolTip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<WikipediaToolTip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<WikipediaToolTip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BubbleChart.svelte generated by Svelte v3.37.0 */

    const { console: console_1$4 } = globals;
    const file$d = "src/BubbleChart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[24] = list;
    	child_ctx[25] = i;
    	return child_ctx;
    }

    // (75:8) {#each leaves as d}
    function create_each_block$3(ctx) {
    	let bubble_1;
    	let updating_d;
    	let current;

    	function bubble_1_d_binding(value) {
    		/*bubble_1_d_binding*/ ctx[14](value, /*d*/ ctx[23], /*each_value*/ ctx[24], /*d_index*/ ctx[25]);
    	}

    	let bubble_1_props = { displayVar: /*displayVar*/ ctx[9] };

    	if (/*d*/ ctx[23] !== void 0) {
    		bubble_1_props.d = /*d*/ ctx[23];
    	}

    	bubble_1 = new Bubble({ props: bubble_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(bubble_1, "d", bubble_1_d_binding));
    	bubble_1.$on("mouseover", /*mouseOver*/ ctx[6]);
    	bubble_1.$on("mouseout", /*mouseOut*/ ctx[8]);
    	bubble_1.$on("mousemove", /*mouseMove*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(bubble_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bubble_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const bubble_1_changes = {};

    			if (!updating_d && dirty & /*leaves*/ 32) {
    				updating_d = true;
    				bubble_1_changes.d = /*d*/ ctx[23];
    				add_flush_callback(() => updating_d = false);
    			}

    			bubble_1.$set(bubble_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bubble_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bubble_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bubble_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(75:8) {#each leaves as d}",
    		ctx
    	});

    	return block;
    }

    // (87:0) {#if isHovered}
    function create_if_block$2(ctx) {
    	let wikipediatooltip;
    	let updating_x;
    	let updating_y;
    	let updating_message;
    	let current;

    	function wikipediatooltip_x_binding(value) {
    		/*wikipediatooltip_x_binding*/ ctx[15](value);
    	}

    	function wikipediatooltip_y_binding(value) {
    		/*wikipediatooltip_y_binding*/ ctx[16](value);
    	}

    	function wikipediatooltip_message_binding(value) {
    		/*wikipediatooltip_message_binding*/ ctx[17](value);
    	}

    	let wikipediatooltip_props = {};

    	if (/*x*/ ctx[3] !== void 0) {
    		wikipediatooltip_props.x = /*x*/ ctx[3];
    	}

    	if (/*y*/ ctx[4] !== void 0) {
    		wikipediatooltip_props.y = /*y*/ ctx[4];
    	}

    	if (/*message*/ ctx[2] !== void 0) {
    		wikipediatooltip_props.message = /*message*/ ctx[2];
    	}

    	wikipediatooltip = new WikipediaToolTip({
    			props: wikipediatooltip_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(wikipediatooltip, "x", wikipediatooltip_x_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "y", wikipediatooltip_y_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "message", wikipediatooltip_message_binding));

    	const block = {
    		c: function create() {
    			create_component(wikipediatooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wikipediatooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const wikipediatooltip_changes = {};

    			if (!updating_x && dirty & /*x*/ 8) {
    				updating_x = true;
    				wikipediatooltip_changes.x = /*x*/ ctx[3];
    				add_flush_callback(() => updating_x = false);
    			}

    			if (!updating_y && dirty & /*y*/ 16) {
    				updating_y = true;
    				wikipediatooltip_changes.y = /*y*/ ctx[4];
    				add_flush_callback(() => updating_y = false);
    			}

    			if (!updating_message && dirty & /*message*/ 4) {
    				updating_message = true;
    				wikipediatooltip_changes.message = /*message*/ ctx[2];
    				add_flush_callback(() => updating_message = false);
    			}

    			wikipediatooltip.$set(wikipediatooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wikipediatooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wikipediatooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wikipediatooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(87:0) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let input;
    	let t3;
    	let div;
    	let svg;
    	let svg_transition;
    	let t4;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*leaves*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*isHovered*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			p = element$2("p");
    			t0 = text("The year is: ");
    			t1 = text(/*year*/ ctx[0]);
    			t2 = space();
    			input = element$2("input");
    			t3 = space();
    			div = element$2("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    			add_location(p, file$d, 67, 0, 1615);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "1790");
    			attr_dev(input, "max", "2021");
    			add_location(input, file$d, 70, 0, 1707);
    			attr_dev(svg, "width", width);
    			attr_dev(svg, "height", height);
    			add_location(svg, file$d, 73, 4, 1773);
    			add_location(div, file$d, 72, 0, 1763);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*year*/ ctx[0]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			insert_dev(target, t4, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[13]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*year*/ 1) set_data_dev(t1, /*year*/ ctx[0]);

    			if (dirty & /*year*/ 1) {
    				set_input_value(input, /*year*/ ctx[0]);
    			}

    			if (dirty & /*displayVar, leaves, mouseOver, mouseOut, mouseMove*/ 992) {
    				each_value = /*leaves*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*isHovered*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isHovered*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!svg_transition) svg_transition = create_bidirectional_transition(svg, fade, {}, true);
    				svg_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!svg_transition) svg_transition = create_bidirectional_transition(svg, fade, {}, false);
    			svg_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && svg_transition) svg_transition.end();
    			if (detaching) detach_dev(t4);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const width = 600;
    const height = 600;

    function instance$d($$self, $$props, $$invalidate) {
    	let users;
    	let root;
    	let leaves;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BubbleChart", slots, []);
    	let { data } = $$props;
    	let isHovered = false;
    	let message;
    	let x;
    	let y;

    	function mouseOver(event) {
    		$$invalidate(2, message = event);
    		$$invalidate(1, isHovered = true);
    		$$invalidate(3, x = event.detail.event.clientX + 5);
    		$$invalidate(4, y = event.detail.event.clientY + 5);
    	}

    	function mouseMove(event) {
    		$$invalidate(3, x = event.detail.event.clientX + 5);
    		$$invalidate(4, y = event.detail.event.clientY + 5);
    	}

    	function mouseOut() {
    		$$invalidate(1, isHovered = false);
    	}

    	let n = 50;
    	let year = 2021;
    	let running = false;
    	let displayVar = "cumulative_time_sen_and_house";
    	let interval;

    	function getLongestServing(data, year, n) {
    		return data.congresses[year].sort((x, y) => x[displayVar] < y[displayVar]);
    	}

    	

    	function toggleAnimation() {
    		running = !running;

    		if (running) {
    			interval = window.setInterval(
    				function () {
    					if (year === 2019) $$invalidate(0, year = 1790); else $$invalidate(0, year = year + 1);
    					console.log(year);
    				},
    				500
    			);
    		} else {
    			clearInterval(interval);
    		}
    	}

    	
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<BubbleChart> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		year = to_number(this.value);
    		$$invalidate(0, year);
    	}

    	function bubble_1_d_binding(value, d, each_value, d_index) {
    		each_value[d_index] = value;
    		(((((($$invalidate(5, leaves), $$invalidate(12, root)), $$invalidate(11, users)), $$invalidate(9, displayVar)), $$invalidate(10, data)), $$invalidate(0, year)), $$invalidate(20, n));
    	}

    	function wikipediatooltip_x_binding(value) {
    		x = value;
    		$$invalidate(3, x);
    	}

    	function wikipediatooltip_y_binding(value) {
    		y = value;
    		$$invalidate(4, y);
    	}

    	function wikipediatooltip_message_binding(value) {
    		message = value;
    		$$invalidate(2, message);
    	}

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(10, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		Bubble,
    		WikipediaToolTip,
    		data,
    		isHovered,
    		message,
    		x,
    		y,
    		mouseOver,
    		mouseMove,
    		mouseOut,
    		n,
    		year,
    		running,
    		displayVar,
    		interval,
    		width,
    		height,
    		getLongestServing,
    		toggleAnimation,
    		users,
    		root,
    		leaves
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(10, data = $$props.data);
    		if ("isHovered" in $$props) $$invalidate(1, isHovered = $$props.isHovered);
    		if ("message" in $$props) $$invalidate(2, message = $$props.message);
    		if ("x" in $$props) $$invalidate(3, x = $$props.x);
    		if ("y" in $$props) $$invalidate(4, y = $$props.y);
    		if ("n" in $$props) $$invalidate(20, n = $$props.n);
    		if ("year" in $$props) $$invalidate(0, year = $$props.year);
    		if ("running" in $$props) running = $$props.running;
    		if ("displayVar" in $$props) $$invalidate(9, displayVar = $$props.displayVar);
    		if ("interval" in $$props) interval = $$props.interval;
    		if ("users" in $$props) $$invalidate(11, users = $$props.users);
    		if ("root" in $$props) $$invalidate(12, root = $$props.root);
    		if ("leaves" in $$props) $$invalidate(5, leaves = $$props.leaves);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, year*/ 1025) {
    			$$invalidate(11, users = getLongestServing(data, year));
    		}

    		if ($$self.$$.dirty & /*users*/ 2048) {
    			$$invalidate(12, root = d3.pack().size([width - 2, height - 2]).padding(1)(d3.hierarchy({ children: users }).sum(d => d[displayVar])));
    		}

    		if ($$self.$$.dirty & /*root*/ 4096) {
    			$$invalidate(5, leaves = root.leaves());
    		}
    	};

    	return [
    		year,
    		isHovered,
    		message,
    		x,
    		y,
    		leaves,
    		mouseOver,
    		mouseMove,
    		mouseOut,
    		displayVar,
    		data,
    		users,
    		root,
    		input_change_input_handler,
    		bubble_1_d_binding,
    		wikipediatooltip_x_binding,
    		wikipediatooltip_y_binding,
    		wikipediatooltip_message_binding
    	];
    }

    class BubbleChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { data: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BubbleChart",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[10] === undefined && !("data" in props)) {
    			console_1$4.warn("<BubbleChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<BubbleChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<BubbleChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BubbleStory.svelte generated by Svelte v3.37.0 */
    const file$c = "src/BubbleStory.svelte";

    // (16:4) 
    function create_background_slot$2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let bubblechart;
    	let current;

    	bubblechart = new BubbleChart({
    			props: { data: /*data*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			h2 = element$2("h2");
    			h2.textContent = "Congress Sized According to Years Spent in Congress";
    			t1 = space();
    			create_component(bubblechart.$$.fragment);
    			add_location(h2, file$c, 16, 8, 309);
    			attr_dev(div, "slot", "background");
    			add_location(div, file$c, 15, 4, 277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			mount_component(bubblechart, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bubblechart_changes = {};
    			if (dirty & /*data*/ 1) bubblechart_changes.data = /*data*/ ctx[0];
    			bubblechart.$set(bubblechart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bubblechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bubblechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(bubblechart);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot$2.name,
    		type: "slot",
    		source: "(16:4) ",
    		ctx
    	});

    	return block;
    }

    // (21:4) 
    function create_foreground_slot$2(ctx) {
    	let div;
    	let section0;
    	let t1;
    	let section1;
    	let t3;
    	let section2;
    	let t5;
    	let section3;

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			section0 = element$2("section");
    			section0.textContent = "Much of the experience is concentrated in a few long-serving politicians. \n            In this chart, each circle represents a member of Congress. The area of the circle corresponds to the number of years spent in Congress. \n            Hover over each circle to see who the circle represents.";
    			t1 = space();
    			section1 = element$2("section");
    			section1.textContent = "Dissatisfaction with the \"career politician\" is a theme among populists on both sides of the aisle.";
    			t3 = space();
    			section2 = element$2("section");
    			section2.textContent = "Are there more career politicians today than there were in the past?\n            This visualization explores age and years of service of members of Congress have changed over time.";
    			t5 = space();
    			section3 = element$2("section");
    			attr_dev(section0, "class", "story-part");
    			add_location(section0, file$c, 21, 8, 480);
    			attr_dev(section1, "class", "story-part");
    			add_location(section1, file$c, 26, 8, 850);
    			attr_dev(section2, "class", "story-part");
    			add_location(section2, file$c, 29, 8, 1010);
    			attr_dev(section3, "class", "blank-story-part");
    			add_location(section3, file$c, 33, 8, 1248);
    			attr_dev(div, "slot", "foreground");
    			attr_dev(div, "class", "foreground");
    			add_location(div, file$c, 20, 4, 429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t1);
    			append_dev(div, section1);
    			append_dev(div, t3);
    			append_dev(div, section2);
    			append_dev(div, t5);
    			append_dev(div, section3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot$2.name,
    		type: "slot",
    		source: "(21:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let scroller;
    	let current;

    	scroller = new Scroller({
    			props: {
    				index: /*index*/ ctx[1],
    				$$slots: {
    					foreground: [create_foreground_slot$2],
    					background: [create_background_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, data*/ 257) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BubbleStory", slots, []);
    	let { data } = $$props;
    	let count;
    	let index;
    	let offset;
    	let progress;
    	let top = 0.1;
    	let threshold = 0.5;
    	let bottom = 0.9;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BubbleStory> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Scroller,
    		BubbleChart,
    		data,
    		count,
    		index,
    		offset,
    		progress,
    		top,
    		threshold,
    		bottom
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("count" in $$props) count = $$props.count;
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("progress" in $$props) progress = $$props.progress;
    		if ("top" in $$props) top = $$props.top;
    		if ("threshold" in $$props) threshold = $$props.threshold;
    		if ("bottom" in $$props) bottom = $$props.bottom;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, index];
    }

    class BubbleStory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BubbleStory",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<BubbleStory> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<BubbleStory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<BubbleStory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var xhtml$1 = "http://www.w3.org/1999/xhtml";

    var namespaces$1 = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml$1,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace$1(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces$1.hasOwnProperty(prefix) ? {space: namespaces$1[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
    }

    function creatorInherit$1(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml$1 && document.documentElement.namespaceURI === xhtml$1
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed$1(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator$1(name) {
      var fullname = namespace$1(name);
      return (fullname.local
          ? creatorFixed$1
          : creatorInherit$1)(fullname);
    }

    function none$1() {}

    function selector$1(selector) {
      return selector == null ? none$1 : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select$1(select) {
      if (typeof select !== "function") select = selector$1(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    function array$1(x) {
      return typeof x === "object" && "length" in x
        ? x // Array, TypedArray, NodeList, array-like
        : Array.from(x); // Map, Set, iterable, string, or anything else
    }

    function empty$1() {
      return [];
    }

    function selectorAll$1(selector) {
      return selector == null ? empty$1 : function() {
        return this.querySelectorAll(selector);
      };
    }

    function arrayAll(select) {
      return function() {
        var group = select.apply(this, arguments);
        return group == null ? [] : array$1(group);
      };
    }

    function selection_selectAll$1(select) {
      if (typeof select === "function") select = arrayAll(select);
      else select = selectorAll$1(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection$1(subgroups, parents);
    }

    function matcher$2(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function childMatcher(selector) {
      return function(node) {
        return node.matches(selector);
      };
    }

    var find = Array.prototype.find;

    function childFind(match) {
      return function() {
        return find.call(this.children, match);
      };
    }

    function childFirst() {
      return this.firstElementChild;
    }

    function selection_selectChild(match) {
      return this.select(match == null ? childFirst
          : childFind(typeof match === "function" ? match : childMatcher(match)));
    }

    var filter = Array.prototype.filter;

    function children() {
      return this.children;
    }

    function childrenFilter(match) {
      return function() {
        return filter.call(this.children, match);
      };
    }

    function selection_selectChildren(match) {
      return this.selectAll(match == null ? children
          : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    }

    function selection_filter$1(match) {
      if (typeof match !== "function") match = matcher$2(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    function sparse$1(update) {
      return new Array(update.length);
    }

    function selection_enter$1() {
      return new Selection$1(this._enter || this._groups.map(sparse$1), this._parents);
    }

    function EnterNode$1(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode$1.prototype = {
      constructor: EnterNode$1,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$3(x) {
      return function() {
        return x;
      };
    }

    function bindIndex$1(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode$1(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey$1(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = new Map,
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
          if (nodeByKeyValue.has(keyValue)) {
            exit[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue.delete(keyValue);
        } else {
          enter[i] = new EnterNode$1(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
          exit[i] = node;
        }
      }
    }

    function datum(node) {
      return node.__data__;
    }

    function selection_data$1(value, key) {
      if (!arguments.length) return Array.from(this, datum);

      var bind = key ? bindKey$1 : bindIndex$1,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$3(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = array$1(value.call(parent, parent && parent.__data__, j, parents)),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection$1(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit$1() {
      return new Selection$1(this._exit || this._groups.map(sparse$1), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
      if (onupdate != null) update = onupdate(update);
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge$1(selection) {
      if (!(selection instanceof Selection$1)) throw new Error("invalid merge");

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection$1(merges, this._parents);
    }

    function selection_order$1() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort$1(compare) {
      if (!compare) compare = ascending$2;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection$1(sortgroups, this._parents).order();
    }

    function ascending$2(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call$1() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes$1() {
      return Array.from(this);
    }

    function selection_node$1() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size$1() {
      let size = 0;
      for (const node of this) ++size; // eslint-disable-line no-unused-vars
      return size;
    }

    function selection_empty$1() {
      return !this.node();
    }

    function selection_each$1(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS$1(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS$1(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr$1(name, value) {
      var fullname = namespace$1(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
    }

    function defaultView$1(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove$1(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction$1(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style$1(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove$1 : typeof value === "function"
                ? styleFunction$1
                : styleConstant$1)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView$1(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove$1(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant$1(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property$1(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove$1 : typeof value === "function"
              ? propertyFunction$1
              : propertyConstant$1)(name, value))
          : this.node()[name];
    }

    function classArray$1(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList$1(node) {
      return node.classList || new ClassList$1(node);
    }

    function ClassList$1(node) {
      this._node = node;
      this._names = classArray$1(node.getAttribute("class") || "");
    }

    ClassList$1.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd$1(node, names) {
      var list = classList$1(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove$1(node, names) {
      var list = classList$1(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue$1(names) {
      return function() {
        classedAdd$1(this, names);
      };
    }

    function classedFalse$1(names) {
      return function() {
        classedRemove$1(this, names);
      };
    }

    function classedFunction$1(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd$1 : classedRemove$1)(this, names);
      };
    }

    function selection_classed$1(name, value) {
      var names = classArray$1(name + "");

      if (arguments.length < 2) {
        var list = classList$1(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction$1 : value
          ? classedTrue$1
          : classedFalse$1)(names, value));
    }

    function textRemove$1() {
      this.textContent = "";
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text$1(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove$1 : (typeof value === "function"
              ? textFunction$1
              : textConstant$1)(value))
          : this.node().textContent;
    }

    function htmlRemove$1() {
      this.innerHTML = "";
    }

    function htmlConstant$1(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html$1(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove$1 : (typeof value === "function"
              ? htmlFunction$1
              : htmlConstant$1)(value))
          : this.node().innerHTML;
    }

    function raise$1() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise$1() {
      return this.each(raise$1);
    }

    function lower$1() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower$1() {
      return this.each(lower$1);
    }

    function selection_append$1(name) {
      var create = typeof name === "function" ? name : creator$1(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull$1() {
      return null;
    }

    function selection_insert$1(name, before) {
      var create = typeof name === "function" ? name : creator$1(name),
          select = before == null ? constantNull$1 : typeof before === "function" ? before : selector$1(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove$1() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove$1() {
      return this.each(remove$1);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum$1(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function contextListener$1(listener) {
      return function(event) {
        listener.call(this, event, this.__data__);
      };
    }

    function parseTypenames$2(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove$1(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd$1(typename, value, options) {
      return function() {
        var on = this.__on, o, listener = contextListener$1(value);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, options);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on$1(typename, value, options) {
      var typenames = parseTypenames$2(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd$1 : onRemove$1;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
      return this;
    }

    function dispatchEvent$1(node, type, params) {
      var window = defaultView$1(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant$1(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params);
      };
    }

    function dispatchFunction$1(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch$1(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction$1
          : dispatchConstant$1)(type, params));
    }

    function* selection_iterator() {
      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) yield node;
        }
      }
    }

    var root$1 = [null];

    function Selection$1(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection_selection() {
      return this;
    }

    Selection$1.prototype = {
      constructor: Selection$1,
      select: selection_select$1,
      selectAll: selection_selectAll$1,
      selectChild: selection_selectChild,
      selectChildren: selection_selectChildren,
      filter: selection_filter$1,
      data: selection_data$1,
      enter: selection_enter$1,
      exit: selection_exit$1,
      join: selection_join,
      merge: selection_merge$1,
      selection: selection_selection,
      order: selection_order$1,
      sort: selection_sort$1,
      call: selection_call$1,
      nodes: selection_nodes$1,
      node: selection_node$1,
      size: selection_size$1,
      empty: selection_empty$1,
      each: selection_each$1,
      attr: selection_attr$1,
      style: selection_style$1,
      property: selection_property$1,
      classed: selection_classed$1,
      text: selection_text$1,
      html: selection_html$1,
      raise: selection_raise$1,
      lower: selection_lower$1,
      append: selection_append$1,
      insert: selection_insert$1,
      remove: selection_remove$1,
      clone: selection_clone,
      datum: selection_datum$1,
      on: selection_on$1,
      dispatch: selection_dispatch$1,
      [Symbol.iterator]: selection_iterator
    };

    function select$1(selector) {
      return typeof selector === "string"
          ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
          : new Selection$1([[selector]], root$1);
    }

    function selectAll(selector) {
      return typeof selector === "string"
          ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection$1([selector == null ? [] : array$1(selector)], root$1);
    }

    var slice$1 = Array.prototype.slice;

    function identity$1(x) {
      return x;
    }

    var top = 1,
        right = 2,
        bottom = 3,
        left = 4,
        epsilon = 1e-6;

    function translateX(x) {
      return "translate(" + x + ",0)";
    }

    function translateY(y) {
      return "translate(0," + y + ")";
    }

    function number$1(scale) {
      return d => +scale(d);
    }

    function center(scale, offset) {
      offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
      if (scale.round()) offset = Math.round(offset);
      return d => +scale(d) + offset;
    }

    function entering() {
      return !this.__axis;
    }

    function axis(orient, scale) {
      var tickArguments = [],
          tickValues = null,
          tickFormat = null,
          tickSizeInner = 6,
          tickSizeOuter = 6,
          tickPadding = 3,
          offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
          k = orient === top || orient === left ? -1 : 1,
          x = orient === left || orient === right ? "x" : "y",
          transform = orient === top || orient === bottom ? translateX : translateY;

      function axis(context) {
        var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
            format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$1) : tickFormat,
            spacing = Math.max(tickSizeInner, 0) + tickPadding,
            range = scale.range(),
            range0 = +range[0] + offset,
            range1 = +range[range.length - 1] + offset,
            position = (scale.bandwidth ? center : number$1)(scale.copy(), offset),
            selection = context.selection ? context.selection() : context,
            path = selection.selectAll(".domain").data([null]),
            tick = selection.selectAll(".tick").data(values, scale).order(),
            tickExit = tick.exit(),
            tickEnter = tick.enter().append("g").attr("class", "tick"),
            line = tick.select("line"),
            text = tick.select("text");

        path = path.merge(path.enter().insert("path", ".tick")
            .attr("class", "domain")
            .attr("stroke", "currentColor"));

        tick = tick.merge(tickEnter);

        line = line.merge(tickEnter.append("line")
            .attr("stroke", "currentColor")
            .attr(x + "2", k * tickSizeInner));

        text = text.merge(tickEnter.append("text")
            .attr("fill", "currentColor")
            .attr(x, k * spacing)
            .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

        if (context !== selection) {
          path = path.transition(context);
          tick = tick.transition(context);
          line = line.transition(context);
          text = text.transition(context);

          tickExit = tickExit.transition(context)
              .attr("opacity", epsilon)
              .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

          tickEnter
              .attr("opacity", epsilon)
              .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
        }

        tickExit.remove();

        path
            .attr("d", orient === left || orient === right
                ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
                : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

        tick
            .attr("opacity", 1)
            .attr("transform", function(d) { return transform(position(d) + offset); });

        line
            .attr(x + "2", k * tickSizeInner);

        text
            .attr(x, k * spacing)
            .text(format);

        selection.filter(entering)
            .attr("fill", "none")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

        selection
            .each(function() { this.__axis = position; });
      }

      axis.scale = function(_) {
        return arguments.length ? (scale = _, axis) : scale;
      };

      axis.ticks = function() {
        return tickArguments = slice$1.call(arguments), axis;
      };

      axis.tickArguments = function(_) {
        return arguments.length ? (tickArguments = _ == null ? [] : slice$1.call(_), axis) : tickArguments.slice();
      };

      axis.tickValues = function(_) {
        return arguments.length ? (tickValues = _ == null ? null : slice$1.call(_), axis) : tickValues && tickValues.slice();
      };

      axis.tickFormat = function(_) {
        return arguments.length ? (tickFormat = _, axis) : tickFormat;
      };

      axis.tickSize = function(_) {
        return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
      };

      axis.tickSizeInner = function(_) {
        return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
      };

      axis.tickSizeOuter = function(_) {
        return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
      };

      axis.tickPadding = function(_) {
        return arguments.length ? (tickPadding = +_, axis) : tickPadding;
      };

      axis.offset = function(_) {
        return arguments.length ? (offset = +_, axis) : offset;
      };

      return axis;
    }

    function axisRight(scale) {
      return axis(right, scale);
    }

    function axisBottom(scale) {
      return axis(bottom, scale);
    }

    function axisLeft(scale) {
      return axis(left, scale);
    }

    /* src/Axis.svelte generated by Svelte v3.37.0 */
    const file$b = "src/Axis.svelte";

    function create_fragment$b(ctx) {
    	let g_1;

    	const block = {
    		c: function create() {
    			g_1 = svg_element("g");
    			attr_dev(g_1, "class", "axis");
    			attr_dev(g_1, "transform", /*transform*/ ctx[1]);
    			add_location(g_1, file$b, 36, 0, 773);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g_1, anchor);
    			/*g_1_binding*/ ctx[7](g_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*transform*/ 2) {
    				attr_dev(g_1, "transform", /*transform*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g_1);
    			/*g_1_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Axis", slots, []);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { margin } = $$props;
    	let { position } = $$props;
    	let { scale } = $$props;
    	let transform;
    	let g;
    	const writable_props = ["width", "height", "margin", "position", "scale"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Axis> was created with unknown prop '${key}'`);
    	});

    	function g_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			g = $$value;
    			$$invalidate(0, g);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("margin" in $$props) $$invalidate(4, margin = $$props.margin);
    		if ("position" in $$props) $$invalidate(5, position = $$props.position);
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    	};

    	$$self.$capture_state = () => ({
    		select: select$1,
    		selectAll,
    		axisBottom,
    		axisLeft,
    		width,
    		height,
    		margin,
    		position,
    		scale,
    		transform,
    		g
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("margin" in $$props) $$invalidate(4, margin = $$props.margin);
    		if ("position" in $$props) $$invalidate(5, position = $$props.position);
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("transform" in $$props) $$invalidate(1, transform = $$props.transform);
    		if ("g" in $$props) $$invalidate(0, g = $$props.g);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*g, position, scale, height, margin*/ 121) {
    			{
    				select$1(g).selectAll("*").remove();
    				let axis;

    				switch (position) {
    					case "bottom":
    						axis = axisBottom(scale).tickSizeOuter(0);
    						$$invalidate(1, transform = `translate(0, ${height - margin})`);
    						break;
    					case "bottom-date":
    						axis = axisBottom(scale).tickSizeOuter(0).tickFormat(d3.format("d"));
    						$$invalidate(1, transform = `translate(0, ${height - margin})`);
    						break;
    					case "left":
    						axis = axisLeft(scale).tickSizeOuter(0);
    						$$invalidate(1, transform = `translate(${margin}, 0)`);
    				}

    				select$1(g).call(axis);
    			}
    		}
    	};

    	return [g, transform, width, height, margin, position, scale, g_1_binding];
    }

    class Axis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			width: 2,
    			height: 3,
    			margin: 4,
    			position: 5,
    			scale: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Axis",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[2] === undefined && !("width" in props)) {
    			console.warn("<Axis> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[3] === undefined && !("height" in props)) {
    			console.warn("<Axis> was created without expected prop 'height'");
    		}

    		if (/*margin*/ ctx[4] === undefined && !("margin" in props)) {
    			console.warn("<Axis> was created without expected prop 'margin'");
    		}

    		if (/*position*/ ctx[5] === undefined && !("position" in props)) {
    			console.warn("<Axis> was created without expected prop 'position'");
    		}

    		if (/*scale*/ ctx[6] === undefined && !("scale" in props)) {
    			console.warn("<Axis> was created without expected prop 'scale'");
    		}
    	}

    	get width() {
    		throw new Error("<Axis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Axis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Axis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Axis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get margin() {
    		throw new Error("<Axis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set margin(value) {
    		throw new Error("<Axis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Axis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Axis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Axis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Axis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Outlier.svelte generated by Svelte v3.37.0 */

    const { console: console_1$3 } = globals;
    const file$a = "src/Outlier.svelte";

    function create_fragment$a(ctx) {
    	let circle;
    	let circle_cy_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "r", "3");
    			attr_dev(circle, "cx", (Math.random() - 0.5) * 4);
    			attr_dev(circle, "cy", circle_cy_value = /*y*/ ctx[1](/*d*/ ctx[0].y));
    			attr_dev(circle, "fill", "white");
    			add_location(circle, file$a, 26, 0, 621);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(circle, "mouseover", /*sendInfo*/ ctx[2], false, false, false),
    					listen_dev(circle, "mouseout", /*sendInfo*/ ctx[2], false, false, false),
    					listen_dev(circle, "mousemove", /*sendInfo*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y, d*/ 3 && circle_cy_value !== (circle_cy_value = /*y*/ ctx[1](/*d*/ ctx[0].y))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Outlier", slots, []);
    	let { d } = $$props;
    	let { y } = $$props;
    	let name;
    	const dispatch = createEventDispatcher();

    	function sendInfo(event) {
    		dispatch(event.type, { text: "Hi there", event, data: d });
    	}

    	
    	onDestroy(d => console.log("Bubble being destroyed"));
    	const writable_props = ["d", "y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Outlier> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("d" in $$props) $$invalidate(0, d = $$props.d);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		fade,
    		d,
    		y,
    		name,
    		dispatch,
    		sendInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ("d" in $$props) $$invalidate(0, d = $$props.d);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*d, name*/ 9) {
    			{
    				$$invalidate(3, name = d.data.official_full);
    				if (name === undefined || name === "unknown") $$invalidate(3, name = d.data.wikipedia);
    			}
    		}
    	};

    	return [d, y, sendInfo, name];
    }

    class Outlier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { d: 0, y: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Outlier",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*d*/ ctx[0] === undefined && !("d" in props)) {
    			console_1$3.warn("<Outlier> was created without expected prop 'd'");
    		}

    		if (/*y*/ ctx[1] === undefined && !("y" in props)) {
    			console_1$3.warn("<Outlier> was created without expected prop 'y'");
    		}
    	}

    	get d() {
    		throw new Error("<Outlier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set d(value) {
    		throw new Error("<Outlier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Outlier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Outlier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Box.svelte generated by Svelte v3.37.0 */
    const file$9 = "src/Box.svelte";

    function create_fragment$9(ctx) {
    	let path0;
    	let path0_d_value;
    	let path0_transition;
    	let t0;
    	let path1;
    	let path1_d_value;
    	let path1_transition;
    	let t1;
    	let path2;
    	let path2_d_value;
    	let path2_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			t0 = space();
    			path1 = svg_element("path");
    			t1 = space();
    			path2 = svg_element("path");
    			attr_dev(path0, "stroke", "currentColor");
    			attr_dev(path0, "d", path0_d_value = /*getPath*/ ctx[1](/*b*/ ctx[0]));
    			add_location(path0, file$9, 39, 0, 812);
    			attr_dev(path1, "fill", "#ddd");
    			attr_dev(path1, "d", path1_d_value = /*getPath2*/ ctx[2](/*b*/ ctx[0]));
    			add_location(path1, file$9, 45, 0, 912);
    			attr_dev(path2, "stroke", "currentColor");
    			attr_dev(path2, "d", path2_d_value = /*getPath3*/ ctx[3](/*b*/ ctx[0]));
    			add_location(path2, file$9, 54, 0, 1088);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, path1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, path2, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(path1, "mouseover", /*sendInfo*/ ctx[4], false, false, false),
    					listen_dev(path1, "mouseout", /*sendInfo*/ ctx[4], false, false, false),
    					listen_dev(path1, "mousemove", /*sendInfo*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*b*/ 1 && path0_d_value !== (path0_d_value = /*getPath*/ ctx[1](/*b*/ ctx[0]))) {
    				attr_dev(path0, "d", path0_d_value);
    			}

    			if (!current || dirty & /*b*/ 1 && path1_d_value !== (path1_d_value = /*getPath2*/ ctx[2](/*b*/ ctx[0]))) {
    				attr_dev(path1, "d", path1_d_value);
    			}

    			if (!current || dirty & /*b*/ 1 && path2_d_value !== (path2_d_value = /*getPath3*/ ctx[3](/*b*/ ctx[0]))) {
    				attr_dev(path2, "d", path2_d_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!path0_transition) path0_transition = create_bidirectional_transition(path0, fade, { duration: 1000 }, true);
    				path0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!path1_transition) path1_transition = create_bidirectional_transition(path1, fade, { duration: 1000 }, true);
    				path1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!path2_transition) path2_transition = create_bidirectional_transition(path2, fade, { duration: 1000 }, true);
    				path2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!path0_transition) path0_transition = create_bidirectional_transition(path0, fade, { duration: 1000 }, false);
    			path0_transition.run(0);
    			if (!path1_transition) path1_transition = create_bidirectional_transition(path1, fade, { duration: 1000 }, false);
    			path1_transition.run(0);
    			if (!path2_transition) path2_transition = create_bidirectional_transition(path2, fade, { duration: 1000 }, false);
    			path2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching && path0_transition) path0_transition.end();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(path1);
    			if (detaching && path1_transition) path1_transition.end();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(path2);
    			if (detaching && path2_transition) path2_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Box", slots, []);
    	let { b } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;

    	function getPath(d) {
    		return `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}`;
    	}

    	

    	function getPath2(d) {
    		return `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z`;
    	}

    	

    	function getPath3(d) {
    		return `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}`;
    	}

    	
    	const dispatch = createEventDispatcher();

    	function sendInfo(event) {
    		dispatch(event.type, { text: "Hi there", event, data: b });
    	}

    	
    	const writable_props = ["b", "x", "y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Box> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("b" in $$props) $$invalidate(0, b = $$props.b);
    		if ("x" in $$props) $$invalidate(5, x = $$props.x);
    		if ("y" in $$props) $$invalidate(6, y = $$props.y);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		draw,
    		fly,
    		createEventDispatcher,
    		b,
    		x,
    		y,
    		getPath,
    		getPath2,
    		getPath3,
    		dispatch,
    		sendInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ("b" in $$props) $$invalidate(0, b = $$props.b);
    		if ("x" in $$props) $$invalidate(5, x = $$props.x);
    		if ("y" in $$props) $$invalidate(6, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [b, getPath, getPath2, getPath3, sendInfo, x, y];
    }

    class Box extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { b: 0, x: 5, y: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Box",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*b*/ ctx[0] === undefined && !("b" in props)) {
    			console.warn("<Box> was created without expected prop 'b'");
    		}

    		if (/*x*/ ctx[5] === undefined && !("x" in props)) {
    			console.warn("<Box> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[6] === undefined && !("y" in props)) {
    			console.warn("<Box> was created without expected prop 'y'");
    		}
    	}

    	get b() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set b(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const boxplotOutcomeVar = writable('cumulative_time_sen_and_house');
    const boxplotRepType = writable('both');

    /* src/BoxTooltip.svelte generated by Svelte v3.37.0 */

    const file$8 = "src/BoxTooltip.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let h40;
    	let t0;
    	let t1;
    	let t2;
    	let h41;
    	let t6;
    	let ul;
    	let li0;
    	let t9;
    	let li1;
    	let t12;
    	let li2;
    	let t15;
    	let li3;
    	let t18;
    	let li4;

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			h40 = element$2("h4");
    			t0 = text("Summary of ");
    			t1 = text(/*label*/ ctx[2]);
    			t2 = space();
    			h41 = element$2("h4");
    			h41.textContent = `${/*data*/ ctx[3].x0} - ${/*data*/ ctx[3].x1}`;
    			t6 = space();
    			ul = element$2("ul");
    			li0 = element$2("li");
    			li0.textContent = `Min: ${/*data*/ ctx[3].absRange[0]}`;
    			t9 = space();
    			li1 = element$2("li");
    			li1.textContent = `25%: ${/*data*/ ctx[3].quartiles[0]}`;
    			t12 = space();
    			li2 = element$2("li");
    			li2.textContent = `50%: ${/*data*/ ctx[3].quartiles[1]}`;
    			t15 = space();
    			li3 = element$2("li");
    			li3.textContent = `75%: ${/*data*/ ctx[3].quartiles[2]}`;
    			t18 = space();
    			li4 = element$2("li");
    			li4.textContent = `Max: ${/*data*/ ctx[3].absRange[1]}`;
    			add_location(h40, file$8, 9, 1, 214);
    			add_location(h41, file$8, 10, 1, 243);
    			add_location(li0, file$8, 12, 2, 285);
    			add_location(li1, file$8, 13, 2, 320);
    			add_location(li2, file$8, 14, 2, 356);
    			add_location(li3, file$8, 15, 2, 392);
    			add_location(li4, file$8, 16, 8, 434);
    			add_location(ul, file$8, 11, 4, 278);
    			set_style(div, "top", /*yToolBox*/ ctx[1] + "px");
    			set_style(div, "left", /*xToolBox*/ ctx[0] + "px");
    			attr_dev(div, "class", "tooltip svelte-5jekx0");
    			add_location(div, file$8, 8, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(h40, t0);
    			append_dev(h40, t1);
    			append_dev(div, t2);
    			append_dev(div, h41);
    			append_dev(div, t6);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(ul, t12);
    			append_dev(ul, li2);
    			append_dev(ul, t15);
    			append_dev(ul, li3);
    			append_dev(ul, t18);
    			append_dev(ul, li4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 4) set_data_dev(t1, /*label*/ ctx[2]);

    			if (dirty & /*yToolBox*/ 2) {
    				set_style(div, "top", /*yToolBox*/ ctx[1] + "px");
    			}

    			if (dirty & /*xToolBox*/ 1) {
    				set_style(div, "left", /*xToolBox*/ ctx[0] + "px");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BoxTooltip", slots, []);
    	let { messageBox } = $$props;
    	let { xToolBox } = $$props;
    	let { yToolBox } = $$props;
    	let { label } = $$props;
    	let data = messageBox.detail.data;
    	const writable_props = ["messageBox", "xToolBox", "yToolBox", "label"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BoxTooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("messageBox" in $$props) $$invalidate(4, messageBox = $$props.messageBox);
    		if ("xToolBox" in $$props) $$invalidate(0, xToolBox = $$props.xToolBox);
    		if ("yToolBox" in $$props) $$invalidate(1, yToolBox = $$props.yToolBox);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		messageBox,
    		xToolBox,
    		yToolBox,
    		label,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ("messageBox" in $$props) $$invalidate(4, messageBox = $$props.messageBox);
    		if ("xToolBox" in $$props) $$invalidate(0, xToolBox = $$props.xToolBox);
    		if ("yToolBox" in $$props) $$invalidate(1, yToolBox = $$props.yToolBox);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("data" in $$props) $$invalidate(3, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [xToolBox, yToolBox, label, data, messageBox];
    }

    class BoxTooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			messageBox: 4,
    			xToolBox: 0,
    			yToolBox: 1,
    			label: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxTooltip",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*messageBox*/ ctx[4] === undefined && !("messageBox" in props)) {
    			console.warn("<BoxTooltip> was created without expected prop 'messageBox'");
    		}

    		if (/*xToolBox*/ ctx[0] === undefined && !("xToolBox" in props)) {
    			console.warn("<BoxTooltip> was created without expected prop 'xToolBox'");
    		}

    		if (/*yToolBox*/ ctx[1] === undefined && !("yToolBox" in props)) {
    			console.warn("<BoxTooltip> was created without expected prop 'yToolBox'");
    		}

    		if (/*label*/ ctx[2] === undefined && !("label" in props)) {
    			console.warn("<BoxTooltip> was created without expected prop 'label'");
    		}
    	}

    	get messageBox() {
    		throw new Error("<BoxTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messageBox(value) {
    		throw new Error("<BoxTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xToolBox() {
    		throw new Error("<BoxTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xToolBox(value) {
    		throw new Error("<BoxTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yToolBox() {
    		throw new Error("<BoxTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yToolBox(value) {
    		throw new Error("<BoxTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<BoxTooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<BoxTooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Boxplot2.svelte generated by Svelte v3.37.0 */
    const file$7 = "src/Boxplot2.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    // (205:20) {#each b.outliers as o}
    function create_each_block_1(ctx) {
    	let outlier;
    	let current;

    	outlier = new Outlier({
    			props: { y: /*y*/ ctx[4], d: /*o*/ ctx[40] },
    			$$inline: true
    		});

    	outlier.$on("mouseover", /*mouseOver*/ ctx[17]);
    	outlier.$on("mouseout", /*mouseOut*/ ctx[19]);
    	outlier.$on("mousemove", /*mouseMove*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(outlier.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(outlier, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const outlier_changes = {};
    			if (dirty[0] & /*y*/ 16) outlier_changes.y = /*y*/ ctx[4];
    			if (dirty[0] & /*bins*/ 4) outlier_changes.d = /*o*/ ctx[40];
    			outlier.$set(outlier_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(outlier.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(outlier.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(outlier, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(205:20) {#each b.outliers as o}",
    		ctx
    	});

    	return block;
    }

    // (195:8) {#each bins as b (b.id)}
    function create_each_block$2(key_1, ctx) {
    	let g1;
    	let box;
    	let g0;
    	let g0_transform_value;
    	let g0_transition;
    	let current;

    	box = new Box({
    			props: {
    				b: /*b*/ ctx[37],
    				x: /*x*/ ctx[3],
    				y: /*y*/ ctx[4]
    			},
    			$$inline: true
    		});

    	box.$on("mouseover", /*mouseOverBox*/ ctx[20]);
    	box.$on("mouseout", /*mouseOutBox*/ ctx[22]);
    	box.$on("mousemove", /*mouseMoveBox*/ ctx[21]);
    	let each_value_1 = /*b*/ ctx[37].outliers;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			g1 = svg_element("g");
    			create_component(box.$$.fragment);
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g0, "fill", "#888");
    			attr_dev(g0, "fill-opacity", ".5");
    			attr_dev(g0, "stroke", "none");
    			attr_dev(g0, "transform", g0_transform_value = `translate(${/*x*/ ctx[3]((/*b*/ ctx[37].x0 + /*b*/ ctx[37].x1) / 2)}, 0)`);
    			add_location(g0, file$7, 201, 16, 5989);
    			add_location(g1, file$7, 195, 12, 5803);
    			this.first = g1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g1, anchor);
    			mount_component(box, g1, null);
    			append_dev(g1, g0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g0, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const box_changes = {};
    			if (dirty[0] & /*bins*/ 4) box_changes.b = /*b*/ ctx[37];
    			if (dirty[0] & /*x*/ 8) box_changes.x = /*x*/ ctx[3];
    			if (dirty[0] & /*y*/ 16) box_changes.y = /*y*/ ctx[4];
    			box.$set(box_changes);

    			if (dirty[0] & /*y, bins, mouseOver, mouseOut, mouseMove*/ 917524) {
    				each_value_1 = /*b*/ ctx[37].outliers;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*x, bins*/ 12 && g0_transform_value !== (g0_transform_value = `translate(${/*x*/ ctx[3]((/*b*/ ctx[37].x0 + /*b*/ ctx[37].x1) / 2)}, 0)`)) {
    				attr_dev(g0, "transform", g0_transform_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!g0_transition) g0_transition = create_bidirectional_transition(g0, fade, { duration: 1000 }, true);
    				g0_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!g0_transition) g0_transition = create_bidirectional_transition(g0, fade, { duration: 1000 }, false);
    			g0_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g1);
    			destroy_component(box);
    			destroy_each(each_blocks, detaching);
    			if (detaching && g0_transition) g0_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(195:8) {#each bins as b (b.id)}",
    		ctx
    	});

    	return block;
    }

    // (218:0) {#if isHovered}
    function create_if_block_1(ctx) {
    	let wikipediatooltip;
    	let updating_x;
    	let updating_y;
    	let updating_message;
    	let current;

    	function wikipediatooltip_x_binding(value) {
    		/*wikipediatooltip_x_binding*/ ctx[30](value);
    	}

    	function wikipediatooltip_y_binding(value) {
    		/*wikipediatooltip_y_binding*/ ctx[31](value);
    	}

    	function wikipediatooltip_message_binding(value) {
    		/*wikipediatooltip_message_binding*/ ctx[32](value);
    	}

    	let wikipediatooltip_props = {};

    	if (/*xTool*/ ctx[7] !== void 0) {
    		wikipediatooltip_props.x = /*xTool*/ ctx[7];
    	}

    	if (/*yTool*/ ctx[8] !== void 0) {
    		wikipediatooltip_props.y = /*yTool*/ ctx[8];
    	}

    	if (/*message*/ ctx[6] !== void 0) {
    		wikipediatooltip_props.message = /*message*/ ctx[6];
    	}

    	wikipediatooltip = new WikipediaToolTip({
    			props: wikipediatooltip_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(wikipediatooltip, "x", wikipediatooltip_x_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "y", wikipediatooltip_y_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "message", wikipediatooltip_message_binding));

    	const block = {
    		c: function create() {
    			create_component(wikipediatooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wikipediatooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const wikipediatooltip_changes = {};

    			if (!updating_x && dirty[0] & /*xTool*/ 128) {
    				updating_x = true;
    				wikipediatooltip_changes.x = /*xTool*/ ctx[7];
    				add_flush_callback(() => updating_x = false);
    			}

    			if (!updating_y && dirty[0] & /*yTool*/ 256) {
    				updating_y = true;
    				wikipediatooltip_changes.y = /*yTool*/ ctx[8];
    				add_flush_callback(() => updating_y = false);
    			}

    			if (!updating_message && dirty[0] & /*message*/ 64) {
    				updating_message = true;
    				wikipediatooltip_changes.message = /*message*/ ctx[6];
    				add_flush_callback(() => updating_message = false);
    			}

    			wikipediatooltip.$set(wikipediatooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wikipediatooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wikipediatooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wikipediatooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(218:0) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    // (222:0) {#if isHoveredBox}
    function create_if_block$1(ctx) {
    	let boxtooltip;
    	let updating_xToolBox;
    	let updating_yToolBox;
    	let updating_messageBox;
    	let current;

    	function boxtooltip_xToolBox_binding(value) {
    		/*boxtooltip_xToolBox_binding*/ ctx[33](value);
    	}

    	function boxtooltip_yToolBox_binding(value) {
    		/*boxtooltip_yToolBox_binding*/ ctx[34](value);
    	}

    	function boxtooltip_messageBox_binding(value) {
    		/*boxtooltip_messageBox_binding*/ ctx[35](value);
    	}

    	let boxtooltip_props = {
    		label: /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]]
    	};

    	if (/*xToolBox*/ ctx[11] !== void 0) {
    		boxtooltip_props.xToolBox = /*xToolBox*/ ctx[11];
    	}

    	if (/*yToolBox*/ ctx[12] !== void 0) {
    		boxtooltip_props.yToolBox = /*yToolBox*/ ctx[12];
    	}

    	if (/*messageBox*/ ctx[10] !== void 0) {
    		boxtooltip_props.messageBox = /*messageBox*/ ctx[10];
    	}

    	boxtooltip = new BoxTooltip({ props: boxtooltip_props, $$inline: true });
    	binding_callbacks.push(() => bind(boxtooltip, "xToolBox", boxtooltip_xToolBox_binding));
    	binding_callbacks.push(() => bind(boxtooltip, "yToolBox", boxtooltip_yToolBox_binding));
    	binding_callbacks.push(() => bind(boxtooltip, "messageBox", boxtooltip_messageBox_binding));

    	const block = {
    		c: function create() {
    			create_component(boxtooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boxtooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const boxtooltip_changes = {};
    			if (dirty[0] & /*outcomeVar*/ 1) boxtooltip_changes.label = /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]];

    			if (!updating_xToolBox && dirty[0] & /*xToolBox*/ 2048) {
    				updating_xToolBox = true;
    				boxtooltip_changes.xToolBox = /*xToolBox*/ ctx[11];
    				add_flush_callback(() => updating_xToolBox = false);
    			}

    			if (!updating_yToolBox && dirty[0] & /*yToolBox*/ 4096) {
    				updating_yToolBox = true;
    				boxtooltip_changes.yToolBox = /*yToolBox*/ ctx[12];
    				add_flush_callback(() => updating_yToolBox = false);
    			}

    			if (!updating_messageBox && dirty[0] & /*messageBox*/ 1024) {
    				updating_messageBox = true;
    				boxtooltip_changes.messageBox = /*messageBox*/ ctx[10];
    				add_flush_callback(() => updating_messageBox = false);
    			}

    			boxtooltip.$set(boxtooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boxtooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boxtooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boxtooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(222:0) {#if isHoveredBox}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]] + "";
    	let t0;
    	let t1;
    	let t2;
    	let form0;
    	let label0;
    	let input0;
    	let t3;
    	let t4;
    	let label1;
    	let input1;
    	let t5;
    	let t6;
    	let form1;
    	let label2;
    	let input2;
    	let t7;
    	let t8;
    	let label3;
    	let input3;
    	let t9;
    	let t10;
    	let label4;
    	let input4;
    	let t11;
    	let t12;
    	let svg;
    	let axis0;
    	let text0;
    	let t13;
    	let axis1;
    	let text1;
    	let t14_value = /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]] + "";
    	let t14;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t15;
    	let t16;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	axis0 = new Axis({
    			props: {
    				width: /*width*/ ctx[16],
    				height: /*height*/ ctx[15],
    				margin: /*margin*/ ctx[14].bottom,
    				scale: /*x*/ ctx[3],
    				position: "bottom-date"
    			},
    			$$inline: true
    		});

    	axis1 = new Axis({
    			props: {
    				width: /*width*/ ctx[16],
    				height: /*height*/ ctx[15],
    				margin: /*margin*/ ctx[14].left,
    				scale: /*y*/ ctx[4],
    				position: "left"
    			},
    			$$inline: true
    		});

    	let each_value = /*bins*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*b*/ ctx[37].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	let if_block0 = /*isHovered*/ ctx[5] && create_if_block_1(ctx);
    	let if_block1 = /*isHoveredBox*/ ctx[9] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			h2 = element$2("h2");
    			t0 = text(t0_value);
    			t1 = text(" In Congress Over Time");
    			t2 = space();
    			form0 = element$2("form");
    			label0 = element$2("label");
    			input0 = element$2("input");
    			t3 = text("\n            Time in Congress");
    			t4 = space();
    			label1 = element$2("label");
    			input1 = element$2("input");
    			t5 = text("\n            Age");
    			t6 = space();
    			form1 = element$2("form");
    			label2 = element$2("label");
    			input2 = element$2("input");
    			t7 = text("\n            Both");
    			t8 = space();
    			label3 = element$2("label");
    			input3 = element$2("input");
    			t9 = text("\n            Senate");
    			t10 = space();
    			label4 = element$2("label");
    			input4 = element$2("input");
    			t11 = text("\n            House");
    			t12 = space();
    			svg = svg_element("svg");
    			create_component(axis0.$$.fragment);
    			text0 = svg_element("text");
    			t13 = text("Year");
    			create_component(axis1.$$.fragment);
    			text1 = svg_element("text");
    			t14 = text(t14_value);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			if (if_block0) if_block0.c();
    			t16 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty$2();
    			add_location(h2, file$7, 147, 4, 4352);
    			attr_dev(input0, "type", "radio");
    			input0.__value = "cumulative_time_sen_and_house";
    			input0.value = input0.__value;
    			/*$$binding_groups*/ ctx[25][0].push(input0);
    			add_location(input0, file$7, 150, 12, 4474);
    			attr_dev(label0, "class", "svelte-16emyax");
    			add_location(label0, file$7, 149, 8, 4454);
    			attr_dev(input1, "type", "radio");
    			input1.__value = "age";
    			input1.value = input1.__value;
    			/*$$binding_groups*/ ctx[25][0].push(input1);
    			add_location(input1, file$7, 155, 12, 4640);
    			attr_dev(label1, "class", "svelte-16emyax");
    			add_location(label1, file$7, 154, 8, 4620);
    			attr_dev(form0, "class", "radio-inline");
    			add_location(form0, file$7, 148, 4, 4418);
    			attr_dev(input2, "type", "radio");
    			input2.__value = "both";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[25][1].push(input2);
    			add_location(input2, file$7, 163, 12, 4787);
    			attr_dev(label2, "class", "svelte-16emyax");
    			add_location(label2, file$7, 162, 8, 4767);
    			attr_dev(input3, "type", "radio");
    			input3.__value = "sen";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[25][1].push(input3);
    			add_location(input3, file$7, 168, 12, 4905);
    			attr_dev(label3, "class", "svelte-16emyax");
    			add_location(label3, file$7, 167, 8, 4885);
    			attr_dev(input4, "type", "radio");
    			input4.__value = "rep";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[25][1].push(input4);
    			add_location(input4, file$7, 173, 12, 5028);
    			attr_dev(label4, "class", "svelte-16emyax");
    			add_location(label4, file$7, 172, 8, 5008);
    			add_location(form1, file$7, 161, 4, 4752);
    			attr_dev(text0, "text-anchor", "middle");
    			attr_dev(text0, "x", /*width*/ ctx[16] / 2);
    			attr_dev(text0, "y", /*height*/ ctx[15] - /*margin*/ ctx[14].bottom / 3);
    			attr_dev(text0, "fill", "black");
    			attr_dev(text0, "class", "svelte-16emyax");
    			add_location(text0, file$7, 182, 8, 5311);
    			attr_dev(text1, "text-anchor", "middle");
    			attr_dev(text1, "fill", "black");
    			attr_dev(text1, "transform", `translate(${/*margin*/ ctx[14].left / 3}, ${/*height*/ ctx[15] / 2}) rotate(270)`);
    			attr_dev(text1, "class", "svelte-16emyax");
    			add_location(text1, file$7, 188, 8, 5547);
    			attr_dev(svg, "width", /*width*/ ctx[16]);
    			attr_dev(svg, "height", /*height*/ ctx[15]);
    			add_location(svg, file$7, 178, 4, 5134);
    			add_location(div, file$7, 146, 0, 4342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);
    			append_dev(div, form0);
    			append_dev(form0, label0);
    			append_dev(label0, input0);
    			input0.checked = input0.__value === /*outcomeVar*/ ctx[0];
    			append_dev(label0, t3);
    			append_dev(form0, t4);
    			append_dev(form0, label1);
    			append_dev(label1, input1);
    			input1.checked = input1.__value === /*outcomeVar*/ ctx[0];
    			append_dev(label1, t5);
    			append_dev(div, t6);
    			append_dev(div, form1);
    			append_dev(form1, label2);
    			append_dev(label2, input2);
    			input2.checked = input2.__value === /*repType*/ ctx[1];
    			append_dev(label2, t7);
    			append_dev(form1, t8);
    			append_dev(form1, label3);
    			append_dev(label3, input3);
    			input3.checked = input3.__value === /*repType*/ ctx[1];
    			append_dev(label3, t9);
    			append_dev(form1, t10);
    			append_dev(form1, label4);
    			append_dev(label4, input4);
    			input4.checked = input4.__value === /*repType*/ ctx[1];
    			append_dev(label4, t11);
    			append_dev(div, t12);
    			append_dev(div, svg);
    			mount_component(axis0, svg, null);
    			append_dev(svg, text0);
    			append_dev(text0, t13);
    			mount_component(axis1, svg, null);
    			append_dev(svg, text1);
    			append_dev(text1, t14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			insert_dev(target, t15, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t16, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[24]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[26]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[27]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[28]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[29])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*outcomeVar*/ 1) && t0_value !== (t0_value = /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*outcomeVar*/ 1) {
    				input0.checked = input0.__value === /*outcomeVar*/ ctx[0];
    			}

    			if (dirty[0] & /*outcomeVar*/ 1) {
    				input1.checked = input1.__value === /*outcomeVar*/ ctx[0];
    			}

    			if (dirty[0] & /*repType*/ 2) {
    				input2.checked = input2.__value === /*repType*/ ctx[1];
    			}

    			if (dirty[0] & /*repType*/ 2) {
    				input3.checked = input3.__value === /*repType*/ ctx[1];
    			}

    			if (dirty[0] & /*repType*/ 2) {
    				input4.checked = input4.__value === /*repType*/ ctx[1];
    			}

    			const axis0_changes = {};
    			if (dirty[0] & /*x*/ 8) axis0_changes.scale = /*x*/ ctx[3];
    			axis0.$set(axis0_changes);
    			const axis1_changes = {};
    			if (dirty[0] & /*y*/ 16) axis1_changes.scale = /*y*/ ctx[4];
    			axis1.$set(axis1_changes);
    			if ((!current || dirty[0] & /*outcomeVar*/ 1) && t14_value !== (t14_value = /*formattedOutcome*/ ctx[13][/*outcomeVar*/ ctx[0]] + "")) set_data_dev(t14, t14_value);

    			if (dirty[0] & /*x, bins, y, mouseOver, mouseOut, mouseMove, mouseOverBox, mouseOutBox, mouseMoveBox*/ 8257564) {
    				each_value = /*bins*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svg, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}

    			if (/*isHovered*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*isHovered*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t16.parentNode, t16);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isHoveredBox*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*isHoveredBox*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axis0.$$.fragment, local);
    			transition_in(axis1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axis0.$$.fragment, local);
    			transition_out(axis1.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[25][0].splice(/*$$binding_groups*/ ctx[25][0].indexOf(input0), 1);
    			/*$$binding_groups*/ ctx[25][0].splice(/*$$binding_groups*/ ctx[25][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[25][1].splice(/*$$binding_groups*/ ctx[25][1].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[25][1].splice(/*$$binding_groups*/ ctx[25][1].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[25][1].splice(/*$$binding_groups*/ ctx[25][1].indexOf(input4), 1);
    			destroy_component(axis0);
    			destroy_component(axis1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t15);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t16);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Boxplot2", slots, []);
    	let { data } = $$props;
    	let outcomeVar;
    	let repType;

    	boxplotOutcomeVar.subscribe(value => {
    		$$invalidate(0, outcomeVar = value);
    	});

    	boxplotRepType.subscribe(value => {
    		$$invalidate(1, repType = value);
    	});

    	let formattedOutcome = {
    		"cumulative_time_sen_and_house": "Years Served",
    		"age": "Age",
    		"nominate_dim1": "Ideology Score (liberal-conservative)"
    	};

    	function getBins(outcomeVar, repType) {
    		let newData = new Array();
    		let bins;
    		let years = new Array();
    		for (let year = 1790; year <= 2019; year++) years.push(year);

    		years.forEach(year => {
    			data.congresses[year].forEach(d => {
    				newData.push({ x: year, y: d[outcomeVar], data: d });
    			});
    		});

    		if (repType !== "both") {
    			newData = newData.filter(d => d.data.type === repType);
    		}

    		if (outcomeVar === "age") newData = newData.filter(d => d.y > 20);

    		bins = d3.histogram().thresholds(23).value(d => d.x)(newData).map(bin => {
    			bin.sort((a, b) => a.y - b.y);
    			const values = bin.map(d => d.y);
    			const min = values[0];
    			const max = values[values.length - 1];
    			const q1 = d3.quantile(values, 0.25);
    			const q2 = d3.quantile(values, 0.5);
    			const q3 = d3.quantile(values, 0.75);
    			const iqr = q3 - q1; // interquartile range
    			const r0 = Math.max(min, q1 - iqr * 1.5);
    			const r1 = Math.min(max, q3 + iqr * 1.5);
    			bin.quartiles = [q1, q2, q3];
    			bin.range = [r0, r1];
    			bin.absRange = [min, max];
    			bin.outliers = bin.filter(v => v.y < r0 || v.y > r1); // TODO

    			// Drop duplicates from outliers
    			const uniqueIds = new Set();

    			const newOutliers = new Array();

    			bin.outliers.reverse().forEach(d => {
    				if (!uniqueIds.has(d.data.id)) {
    					uniqueIds.add(d.data.id);
    					newOutliers.push(d);
    				}
    			});

    			bin.outliers = newOutliers;
    			bin.id = outcomeVar + "/" + repType + "/" + bin.x0;
    			return bin;
    		});

    		let x = d3.scaleLinear().domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)]).rangeRound([margin.left, width - margin.right]);
    		let y = d3.scaleLinear().domain([d3.min(bins, d => d.absRange[0]), d3.max(bins, d => d.absRange[1])]).nice().range([height - margin.bottom, margin.top]);
    		return { bins, x, y };
    	}

    	
    	let margin = { top: 20, right: 20, bottom: 60, left: 50 };
    	let height = 600;
    	let width = 600;
    	let bins;
    	let x;
    	let y;

    	// Tool tip
    	let isHovered = false;

    	let message;
    	let xTool;
    	let yTool;

    	function mouseOver(event) {
    		$$invalidate(6, message = event);
    		$$invalidate(5, isHovered = true);
    		$$invalidate(7, xTool = event.detail.event.clientX + 5);
    		$$invalidate(8, yTool = event.detail.event.clientY + 5);
    	}

    	function mouseMove(event) {
    		$$invalidate(7, xTool = event.detail.event.clientX + 5);
    		$$invalidate(8, yTool = event.detail.event.clientY + 5);
    	}

    	function mouseOut() {
    		$$invalidate(5, isHovered = false);
    	}

    	//Boxplot tooltip
    	let isHoveredBox = false;

    	let messageBox;
    	let xToolBox;
    	let yToolBox;

    	function mouseOverBox(event) {
    		$$invalidate(10, messageBox = event);
    		$$invalidate(9, isHoveredBox = true);
    		$$invalidate(11, xToolBox = event.detail.event.clientX);
    		$$invalidate(12, yToolBox = event.detail.event.clientY);
    	}

    	function mouseMoveBox(event) {
    		$$invalidate(11, xToolBox = event.detail.event.clientX);
    		$$invalidate(12, yToolBox = event.detail.event.clientY);
    	}

    	function mouseOutBox() {
    		$$invalidate(9, isHoveredBox = false);
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Boxplot2> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function input0_change_handler() {
    		outcomeVar = this.__value;
    		$$invalidate(0, outcomeVar);
    	}

    	function input1_change_handler() {
    		outcomeVar = this.__value;
    		$$invalidate(0, outcomeVar);
    	}

    	function input2_change_handler() {
    		repType = this.__value;
    		$$invalidate(1, repType);
    	}

    	function input3_change_handler() {
    		repType = this.__value;
    		$$invalidate(1, repType);
    	}

    	function input4_change_handler() {
    		repType = this.__value;
    		$$invalidate(1, repType);
    	}

    	function wikipediatooltip_x_binding(value) {
    		xTool = value;
    		$$invalidate(7, xTool);
    	}

    	function wikipediatooltip_y_binding(value) {
    		yTool = value;
    		$$invalidate(8, yTool);
    	}

    	function wikipediatooltip_message_binding(value) {
    		message = value;
    		$$invalidate(6, message);
    	}

    	function boxtooltip_xToolBox_binding(value) {
    		xToolBox = value;
    		$$invalidate(11, xToolBox);
    	}

    	function boxtooltip_yToolBox_binding(value) {
    		yToolBox = value;
    		$$invalidate(12, yToolBox);
    	}

    	function boxtooltip_messageBox_binding(value) {
    		messageBox = value;
    		$$invalidate(10, messageBox);
    	}

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(23, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Axis,
    		Outlier,
    		fade,
    		draw,
    		fly,
    		WikipediaToolTip,
    		Box,
    		boxplotOutcomeVar,
    		boxplotRepType,
    		BoxTooltip,
    		data,
    		outcomeVar,
    		repType,
    		formattedOutcome,
    		getBins,
    		margin,
    		height,
    		width,
    		bins,
    		x,
    		y,
    		isHovered,
    		message,
    		xTool,
    		yTool,
    		mouseOver,
    		mouseMove,
    		mouseOut,
    		isHoveredBox,
    		messageBox,
    		xToolBox,
    		yToolBox,
    		mouseOverBox,
    		mouseMoveBox,
    		mouseOutBox
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(23, data = $$props.data);
    		if ("outcomeVar" in $$props) $$invalidate(0, outcomeVar = $$props.outcomeVar);
    		if ("repType" in $$props) $$invalidate(1, repType = $$props.repType);
    		if ("formattedOutcome" in $$props) $$invalidate(13, formattedOutcome = $$props.formattedOutcome);
    		if ("margin" in $$props) $$invalidate(14, margin = $$props.margin);
    		if ("height" in $$props) $$invalidate(15, height = $$props.height);
    		if ("width" in $$props) $$invalidate(16, width = $$props.width);
    		if ("bins" in $$props) $$invalidate(2, bins = $$props.bins);
    		if ("x" in $$props) $$invalidate(3, x = $$props.x);
    		if ("y" in $$props) $$invalidate(4, y = $$props.y);
    		if ("isHovered" in $$props) $$invalidate(5, isHovered = $$props.isHovered);
    		if ("message" in $$props) $$invalidate(6, message = $$props.message);
    		if ("xTool" in $$props) $$invalidate(7, xTool = $$props.xTool);
    		if ("yTool" in $$props) $$invalidate(8, yTool = $$props.yTool);
    		if ("isHoveredBox" in $$props) $$invalidate(9, isHoveredBox = $$props.isHoveredBox);
    		if ("messageBox" in $$props) $$invalidate(10, messageBox = $$props.messageBox);
    		if ("xToolBox" in $$props) $$invalidate(11, xToolBox = $$props.xToolBox);
    		if ("yToolBox" in $$props) $$invalidate(12, yToolBox = $$props.yToolBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*outcomeVar, repType*/ 3) {
    			{
    				let returnVal = getBins(outcomeVar, repType);
    				$$invalidate(2, bins = returnVal.bins);
    				$$invalidate(3, x = returnVal.x);
    				$$invalidate(4, y = returnVal.y);
    			}
    		}
    	};

    	return [
    		outcomeVar,
    		repType,
    		bins,
    		x,
    		y,
    		isHovered,
    		message,
    		xTool,
    		yTool,
    		isHoveredBox,
    		messageBox,
    		xToolBox,
    		yToolBox,
    		formattedOutcome,
    		margin,
    		height,
    		width,
    		mouseOver,
    		mouseMove,
    		mouseOut,
    		mouseOverBox,
    		mouseMoveBox,
    		mouseOutBox,
    		data,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		input4_change_handler,
    		wikipediatooltip_x_binding,
    		wikipediatooltip_y_binding,
    		wikipediatooltip_message_binding,
    		boxtooltip_xToolBox_binding,
    		boxtooltip_yToolBox_binding,
    		boxtooltip_messageBox_binding
    	];
    }

    class Boxplot2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 23 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Boxplot2",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[23] === undefined && !("data" in props)) {
    			console.warn("<Boxplot2> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Boxplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Boxplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BoxplotStory.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/BoxplotStory.svelte";

    // (52:8) 
    function create_background_slot$1(ctx) {
    	let div;
    	let boxplot2;
    	let current;

    	boxplot2 = new Boxplot2({
    			props: { data: /*data*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			create_component(boxplot2.$$.fragment);
    			attr_dev(div, "slot", "background");
    			add_location(div, file$6, 51, 8, 1149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(boxplot2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const boxplot2_changes = {};
    			if (dirty & /*data*/ 1) boxplot2_changes.data = /*data*/ ctx[0];
    			boxplot2.$set(boxplot2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boxplot2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boxplot2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(boxplot2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot$1.name,
    		type: "slot",
    		source: "(52:8) ",
    		ctx
    	});

    	return block;
    }

    // (56:8) 
    function create_foreground_slot$1(ctx) {
    	let div;
    	let section0;
    	let t1;
    	let section1;
    	let t3;
    	let section2;
    	let t5;
    	let section3;
    	let t7;
    	let section4;
    	let t9;
    	let section5;
    	let t11;
    	let section6;
    	let t13;
    	let section7;
    	let t15;
    	let section8;
    	let t17;
    	let section9;

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			section0 = element$2("section");
    			section0.textContent = "Let's take a look at the distribution of experience in Congress over the years... \n                The following chart shows boxplots of the distribution of years in Congress by decade. Hover over outliers to see the longest serving members. \n                Hover over each boxplot to see summary statistics.";
    			t1 = space();
    			section1 = element$2("section");
    			section1.textContent = "Time spent in Congress was relatively flat up until WW2.";
    			t3 = space();
    			section2 = element$2("section");
    			section2.textContent = "After WW2, members of Congress began to serve longer terms.";
    			t5 = space();
    			section3 = element$2("section");
    			section3.textContent = "How about average age in Congress?";
    			t7 = space();
    			section4 = element$2("section");
    			section4.textContent = "While age has gone up, this trend has largely tracked with life expectancy.";
    			t9 = space();
    			section5 = element$2("section");
    			section5.textContent = "Adjusted for life expectancy, Congress is actually younger than it once was.";
    			t11 = space();
    			section6 = element$2("section");
    			section6.textContent = "How do patterns vary by house and senate?";
    			t13 = space();
    			section7 = element$2("section");
    			section7.textContent = "In the senate, the median time in Congress increased from 6 years to 12 following WW2. \n                \n                While the median number of terms has only increased by 1 term, the interquartile range has increased considerably. \n                25% of senators have served for 24 years.";
    			t15 = space();
    			section8 = element$2("section");
    			section8.textContent = "The increases in time spent in the House have been more dramatic. The average House member serves 4 terms. \n                John Dingell, the House member with the longest tenure ever, spent 60 years as a representative from Michigan! 30 consecutive terms.";
    			t17 = space();
    			section9 = element$2("section");
    			attr_dev(section0, "class", "story-part");
    			add_location(section0, file$6, 56, 12, 1266);
    			attr_dev(section1, "class", "story-part");
    			add_location(section1, file$6, 60, 12, 1644);
    			attr_dev(section2, "class", "story-part");
    			add_location(section2, file$6, 62, 12, 1753);
    			attr_dev(section3, "class", "story-part");
    			add_location(section3, file$6, 64, 23, 1875);
    			attr_dev(section4, "class", "story-part");
    			add_location(section4, file$6, 66, 23, 1972);
    			attr_dev(section5, "class", "story-part");
    			add_location(section5, file$6, 68, 23, 2110);
    			attr_dev(section6, "class", "story-part");
    			add_location(section6, file$6, 70, 23, 2249);
    			attr_dev(section7, "class", "story-part");
    			add_location(section7, file$6, 72, 23, 2353);
    			attr_dev(section8, "class", "story-part");
    			add_location(section8, file$6, 77, 23, 2711);
    			attr_dev(section9, "class", "blank-story-part");
    			add_location(section9, file$6, 80, 23, 3043);
    			attr_dev(div, "slot", "foreground");
    			add_location(div, file$6, 55, 8, 1230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t1);
    			append_dev(div, section1);
    			append_dev(div, t3);
    			append_dev(div, section2);
    			append_dev(div, t5);
    			append_dev(div, section3);
    			append_dev(div, t7);
    			append_dev(div, section4);
    			append_dev(div, t9);
    			append_dev(div, section5);
    			append_dev(div, t11);
    			append_dev(div, section6);
    			append_dev(div, t13);
    			append_dev(div, section7);
    			append_dev(div, t15);
    			append_dev(div, section8);
    			append_dev(div, t17);
    			append_dev(div, section9);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot$1.name,
    		type: "slot",
    		source: "(56:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let scroller;
    	let updating_count;
    	let updating_index;
    	let updating_offset;
    	let updating_progress;
    	let current;

    	function scroller_count_binding(value) {
    		/*scroller_count_binding*/ ctx[8](value);
    	}

    	function scroller_index_binding(value) {
    		/*scroller_index_binding*/ ctx[9](value);
    	}

    	function scroller_offset_binding(value) {
    		/*scroller_offset_binding*/ ctx[10](value);
    	}

    	function scroller_progress_binding(value) {
    		/*scroller_progress_binding*/ ctx[11](value);
    	}

    	let scroller_props = {
    		top: /*top*/ ctx[5],
    		threshold: /*threshold*/ ctx[6],
    		bottom: /*bottom*/ ctx[7],
    		$$slots: {
    			foreground: [create_foreground_slot$1],
    			background: [create_background_slot$1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*count*/ ctx[2] !== void 0) {
    		scroller_props.count = /*count*/ ctx[2];
    	}

    	if (/*index*/ ctx[1] !== void 0) {
    		scroller_props.index = /*index*/ ctx[1];
    	}

    	if (/*offset*/ ctx[3] !== void 0) {
    		scroller_props.offset = /*offset*/ ctx[3];
    	}

    	if (/*progress*/ ctx[4] !== void 0) {
    		scroller_props.progress = /*progress*/ ctx[4];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, "count", scroller_count_binding));
    	binding_callbacks.push(() => bind(scroller, "index", scroller_index_binding));
    	binding_callbacks.push(() => bind(scroller, "offset", scroller_offset_binding));
    	binding_callbacks.push(() => bind(scroller, "progress", scroller_progress_binding));

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, data*/ 4097) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_count && dirty & /*count*/ 4) {
    				updating_count = true;
    				scroller_changes.count = /*count*/ ctx[2];
    				add_flush_callback(() => updating_count = false);
    			}

    			if (!updating_index && dirty & /*index*/ 2) {
    				updating_index = true;
    				scroller_changes.index = /*index*/ ctx[1];
    				add_flush_callback(() => updating_index = false);
    			}

    			if (!updating_offset && dirty & /*offset*/ 8) {
    				updating_offset = true;
    				scroller_changes.offset = /*offset*/ ctx[3];
    				add_flush_callback(() => updating_offset = false);
    			}

    			if (!updating_progress && dirty & /*progress*/ 16) {
    				updating_progress = true;
    				scroller_changes.progress = /*progress*/ ctx[4];
    				add_flush_callback(() => updating_progress = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BoxplotStory", slots, []);
    	let { data } = $$props;

    	// Scroller stuff
    	let count;

    	let index;
    	let offset;
    	let progress;
    	let top = 0.1;
    	let threshold = 0.5;
    	let bottom = 0.9;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BoxplotStory> was created with unknown prop '${key}'`);
    	});

    	function scroller_count_binding(value) {
    		count = value;
    		$$invalidate(2, count);
    	}

    	function scroller_index_binding(value) {
    		index = value;
    		$$invalidate(1, index);
    	}

    	function scroller_offset_binding(value) {
    		offset = value;
    		$$invalidate(3, offset);
    	}

    	function scroller_progress_binding(value) {
    		progress = value;
    		$$invalidate(4, progress);
    	}

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Boxplot2,
    		boxplotOutcomeVar,
    		boxplotRepType,
    		Scroller,
    		data,
    		count,
    		index,
    		offset,
    		progress,
    		top,
    		threshold,
    		bottom
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("count" in $$props) $$invalidate(2, count = $$props.count);
    		if ("index" in $$props) $$invalidate(1, index = $$props.index);
    		if ("offset" in $$props) $$invalidate(3, offset = $$props.offset);
    		if ("progress" in $$props) $$invalidate(4, progress = $$props.progress);
    		if ("top" in $$props) $$invalidate(5, top = $$props.top);
    		if ("threshold" in $$props) $$invalidate(6, threshold = $$props.threshold);
    		if ("bottom" in $$props) $$invalidate(7, bottom = $$props.bottom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index*/ 2) {
    			{
    				switch (index) {
    					case 0:
    						boxplotOutcomeVar.set("cumulative_time_sen_and_house");
    						break;
    					case 2:
    						boxplotOutcomeVar.set("cumulative_time_sen_and_house");
    						break;
    					case 3:
    						boxplotOutcomeVar.set("age");
    						break;
    					case 5:
    						boxplotOutcomeVar.set("age");
    						boxplotRepType.set("both");
    						break;
    					case 7:
    						boxplotOutcomeVar.set("cumulative_time_sen_and_house");
    						boxplotRepType.set("sen");
    						break;
    					case 8:
    						boxplotOutcomeVar.set("cumulative_time_sen_and_house");
    						boxplotRepType.set("rep");
    						break;
    				}
    			}
    		}
    	};

    	return [
    		data,
    		index,
    		count,
    		offset,
    		progress,
    		top,
    		threshold,
    		bottom,
    		scroller_count_binding,
    		scroller_index_binding,
    		scroller_offset_binding,
    		scroller_progress_binding
    	];
    }

    class BoxplotStory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxplotStory",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<BoxplotStory> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<BoxplotStory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<BoxplotStory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    var matcher = function(selector) {
      return function() {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!element$1.matches) {
        var vendorMatches = element$1.webkitMatchesSelector
            || element$1.msMatchesSelector
            || element$1.mozMatchesSelector
            || element$1.oMatchesSelector;
        matcher = function(selector) {
          return function() {
            return vendorMatches.call(this, selector);
          };
        };
      }
    }

    var matcher$1 = matcher;

    var filterEvents = {};

    if (typeof document !== "undefined") {
      var element = document.documentElement;
      if (!("onmouseenter" in element)) {
        filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function(event1) {
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
        }
      };
    }

    function parseTypenames$1(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, capture) {
      var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll(select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
          exit[i] = node;
        }
      }
    }

    function selection_data(value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) { data[++j] = d; });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$2(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge(selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      var node;
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : defaultView(node = this.node())
              .getComputedStyle(node, null)
              .getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (event) {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    Selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatDefault(x, p) {
      x = x.toPrecision(p);

      out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (x[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          case "e": break out;
          default: if (i0 > 0) i0 = 0; break;
        }
      }

      return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "": formatDefault,
      "%": function(x, p) { return (x * 100).toFixed(p); },
      "b": function(x) { return Math.round(x).toString(2); },
      "c": function(x) { return x + ""; },
      "d": function(x) { return Math.round(x).toString(10); },
      "e": function(x, p) { return x.toExponential(p); },
      "f": function(x, p) { return x.toFixed(p); },
      "g": function(x, p) { return x.toPrecision(p); },
      "o": function(x) { return Math.round(x).toString(8); },
      "p": function(x, p) { return formatRounded(x * 100, p); },
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
      "x": function(x) { return Math.round(x).toString(16); }
    };

    // [[fill]align][sign][symbol][0][width][,][.precision][type]
    var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      return new FormatSpecifier(specifier);
    }

    function FormatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

      var match,
          fill = match[1] || " ",
          align = match[2] || ">",
          sign = match[3] || "-",
          symbol = match[4] || "",
          zero = !!match[5],
          width = match[6] && +match[6],
          comma = !!match[7],
          precision = match[8] && +match[8].slice(1),
          type = match[9] || "";

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // Map invalid types to the default format.
      else if (!formatTypes[type]) type = "";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      this.fill = fill;
      this.align = align;
      this.sign = sign;
      this.symbol = symbol;
      this.zero = zero;
      this.width = width;
      this.comma = comma;
      this.precision = precision;
      this.type = type;
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width == null ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
          + this.type;
    };

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function identity(x) {
      return x;
    }

    function formatLocale(locale) {
      var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
          currency = locale.currency,
          decimal = locale.decimal;

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            type = specifier.type;

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = !type || /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision == null ? (type ? 6 : 12)
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Convert negative to positive, and compute the prefix.
            // Note that -0 is not less than 0, but 1 / -0 is!
            var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

            // Perform the initial formatting.
            value = formatType(value, precision);

            // If the original value was negative, it may be rounded to zero during
            // formatting; treat this as (positive) zero.
            if (valueNegative) {
              i = -1, n = value.length;
              valueNegative = false;
              while (++i < n) {
                if (c = value.charCodeAt(i), (48 < c && c < 58)
                    || (type === "x" && 96 < c && c < 103)
                    || (type === "X" && 64 < c && c < 71)) {
                  valueNegative = true;
                  break;
                }
              }
            }

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": return valuePrefix + value + valueSuffix + padding;
            case "=": return valuePrefix + padding + value + valueSuffix;
            case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          }
          return padding + valuePrefix + value + valueSuffix;
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    var noop = {value: function() {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
      if (compare.length === 1) compare = ascendingComparator(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator(f) {
      return function(d, x) {
        return ascending(f(d), x);
      };
    }

    var ascendingBisect = bisector(ascending);
    var bisectRight = ascendingBisect.right;

    function sequence(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var step = tickStep(start, stop, count);
      return sequence(
        Math.ceil(start / step) * step,
        Math.floor(stop / step) * step + step / 2, // inclusive
        step
      );
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function max(array, f) {
      var i = -1,
          n = array.length,
          a,
          b;

      if (f == null) {
        while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
        while (++i < n) if ((b = array[i]) != null && b > a) a = b;
      }

      else {
        while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
        while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
      }

      return a;
    }

    function sum(array, f) {
      var s = 0,
          n = array.length,
          a,
          i = -1;

      if (f == null) {
        while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
      }

      else {
        while (++i < n) if (a = +f(array[i], i, array)) s += a;
      }

      return s;
    }

    var prefix = "$";

    function Map$1() {}

    Map$1.prototype = map$1.prototype = {
      constructor: Map$1,
      has: function(key) {
        return (prefix + key) in this;
      },
      get: function(key) {
        return this[prefix + key];
      },
      set: function(key, value) {
        this[prefix + key] = value;
        return this;
      },
      remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
      },
      clear: function() {
        for (var property in this) if (property[0] === prefix) delete this[property];
      },
      keys: function() {
        var keys = [];
        for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
        return keys;
      },
      values: function() {
        var values = [];
        for (var property in this) if (property[0] === prefix) values.push(this[property]);
        return values;
      },
      entries: function() {
        var entries = [];
        for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
        return entries;
      },
      size: function() {
        var size = 0;
        for (var property in this) if (property[0] === prefix) ++size;
        return size;
      },
      empty: function() {
        for (var property in this) if (property[0] === prefix) return false;
        return true;
      },
      each: function(f) {
        for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    };

    function map$1(object, f) {
      var map = new Map$1;

      // Copy constructor.
      if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

      // Index array by numeric index or specified key function.
      else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) map.set(i, object[i]);
        else while (++i < n) map.set(f(o = object[i], i, object), o);
      }

      // Convert object to map.
      else if (object) for (var key in object) map.set(key, object[key]);

      return map;
    }

    function Set$1() {}

    var proto = map$1.prototype;

    Set$1.prototype = {
      constructor: Set$1,
      has: proto.has,
      add: function(value) {
        value += "";
        this[prefix + value] = value;
        return this;
      },
      remove: proto.remove,
      clear: proto.clear,
      values: proto.keys,
      size: proto.size,
      empty: proto.empty,
      each: proto.each
    };

    var array = Array.prototype;

    var map = array.map;
    var slice = array.slice;

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color$1, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color$1(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color$1(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color$1(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    var A = -0.14861,
        B = +1.78277,
        C = -0.29227,
        D = -0.90649,
        E = +1.97294,
        ED = E * D,
        EB = E * B,
        BC_DA = B * C - D * A;

    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
          h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix$1(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(
          255 * (l + a * (A * cosh + B * sinh)),
          255 * (l + a * (C * cosh + D * sinh)),
          255 * (l + a * (E * cosh)),
          this.opacity
        );
      }
    }));

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function hue(a, b) {
      var d = b - a;
      return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function reinterpolate(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolateValue(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: reinterpolate(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolateValue(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$1(b)
          : (t === "number" ? reinterpolate
          : t === "string" ? ((c = color$1(b)) ? (b = c, rgb) : string)
          : b instanceof color$1 ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : reinterpolate)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function cubehelix(hue) {
      return (function cubehelixGamma(y) {
        y = +y;

        function cubehelix(start, end) {
          var h = hue((start = cubehelix$1(start)).h, (end = cubehelix$1(end)).h),
              s = nogamma(start.s, end.s),
              l = nogamma(start.l, end.l),
              opacity = nogamma(start.opacity, end.opacity);
          return function(t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(Math.pow(t, y));
            start.opacity = opacity(t);
            return start + "";
          };
        }

        cubehelix.gamma = cubehelixGamma;

        return cubehelix;
      })(1);
    }

    cubehelix(hue);
    var cubehelixLong = cubehelix(nogamma);

    function constant(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function deinterpolateLinear(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constant(b);
    }

    function deinterpolateClamp(deinterpolate) {
      return function(a, b) {
        var d = deinterpolate(a = +a, b = +b);
        return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
      };
    }

    function reinterpolateClamp(reinterpolate) {
      return function(a, b) {
        var r = reinterpolate(a = +a, b = +b);
        return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
      };
    }

    function bimap(domain, range, deinterpolate, reinterpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
      else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, deinterpolate, reinterpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = deinterpolate(domain[i], domain[i + 1]);
        r[i] = reinterpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp());
    }

    // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
    function continuous(deinterpolate, reinterpolate) {
      var domain = unit,
          range = unit,
          interpolate = interpolateValue,
          clamp = false,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
      }

      scale.invert = function(y) {
        return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = map.call(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = slice.call(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = !!_, rescale()) : clamp;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      return rescale();
    }

    function tickFormat(domain, count, specifier) {
      var start = domain[0],
          stop = domain[domain.length - 1],
          step = tickStep(start, stop, count == null ? 10 : count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        return tickFormat(domain(), count, specifier);
      };

      scale.nice = function(count) {
        var d = domain(),
            i = d.length - 1,
            n = count == null ? 10 : count,
            start = d[0],
            stop = d[i],
            step = tickStep(start, stop, n);

        if (step) {
          step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
          d[0] = Math.floor(start / step) * step;
          d[i] = Math.ceil(stop / step) * step;
          domain(d);
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous(deinterpolateLinear, reinterpolate);

      scale.copy = function() {
        return copy(scale, linear());
      };

      return linearish(scale);
    }

    function colors(s) {
      return s.match(/.{6}/g).map(function(x) {
        return "#" + x;
      });
    }

    colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

    colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

    colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

    colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

    cubehelixLong(cubehelix$1(300, 0.5, 0.0), cubehelix$1(-240, 0.5, 1.0));

    cubehelixLong(cubehelix$1(-100, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));

    cubehelixLong(cubehelix$1(260, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));

    cubehelix$1();

    function ramp(range) {
      var n = range.length;
      return function(t) {
        return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
      };
    }

    ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

    ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

    ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

    ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var d3_identity = function d3_identity(d) {
      return d;
    };

    var d3_reverse = function d3_reverse(arr) {
      var mirror = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        mirror[i] = arr[l - i - 1];
      }
      return mirror;
    };

    //Text wrapping code adapted from Mike Bostock
    var d3_textWrapping = function d3_textWrapping(text, width) {
      text.each(function () {
        var text = select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineHeight = 1.2;
            //ems
        text.attr("y");
            var dy = parseFloat(text.attr("dy")) || 0,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width && line.length > 1) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
          }
        }
      });
    };

    var d3_mergeLabels = function d3_mergeLabels() {
      var gen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var labels = arguments[1];
      var domain = arguments[2];
      var range = arguments[3];
      var labelDelimiter = arguments[4];

      if ((typeof labels === "undefined" ? "undefined" : _typeof(labels)) === "object") {
        if (labels.length === 0) return gen;

        var i = labels.length;
        for (; i < gen.length; i++) {
          labels.push(gen[i]);
        }
        return labels;
      } else if (typeof labels === "function") {
        var customLabels = [];
        var genLength = gen.length;
        for (var _i = 0; _i < genLength; _i++) {
          customLabels.push(labels({
            i: _i,
            genLength: genLength,
            generatedLabels: gen,
            domain: domain,
            range: range,
            labelDelimiter: labelDelimiter
          }));
        }
        return customLabels;
      }

      return gen;
    };

    var d3_linearLegend = function d3_linearLegend(scale, cells, labelFormat) {
      var data = [];

      if (cells.length > 1) {
        data = cells;
      } else {
        var domain = scale.domain(),
            increment = (domain[domain.length - 1] - domain[0]) / (cells - 1);
        var i = 0;

        for (; i < cells; i++) {
          data.push(domain[0] + i * increment);
        }
      }

      var labels = data.map(labelFormat);
      return {
        data: data,
        labels: labels,
        feature: function feature(d) {
          return scale(d);
        }
      };
    };

    var d3_quantLegend = function d3_quantLegend(scale, labelFormat, labelDelimiter) {
      var labels = scale.range().map(function (d) {
        var invert = scale.invertExtent(d);
        return labelFormat(invert[0]) + " " + labelDelimiter + " " + labelFormat(invert[1]);
      });

      return {
        data: scale.range(),
        labels: labels,
        feature: d3_identity
      };
    };

    var d3_ordinalLegend = function d3_ordinalLegend(scale) {
      return {
        data: scale.domain(),
        labels: scale.domain(),
        feature: function feature(d) {
          return scale(d);
        }
      };
    };

    var d3_cellOver = function d3_cellOver(cellDispatcher, d, obj) {
      cellDispatcher.call("cellover", obj, d);
    };

    var d3_cellOut = function d3_cellOut(cellDispatcher, d, obj) {
      cellDispatcher.call("cellout", obj, d);
    };

    var d3_cellClick = function d3_cellClick(cellDispatcher, d, obj) {
      cellDispatcher.call("cellclick", obj, d);
    };

    var helper = {
      d3_drawShapes: function d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path) {
        if (shape === "rect") {
          shapes.attr("height", shapeHeight).attr("width", shapeWidth);
        } else if (shape === "circle") {
          shapes.attr("r", shapeRadius);
        } else if (shape === "line") {
          shapes.attr("x1", 0).attr("x2", shapeWidth).attr("y1", 0).attr("y2", 0);
        } else if (shape === "path") {
          shapes.attr("d", path);
        }
      },

      d3_addText: function d3_addText(svg, enter, labels, classPrefix, labelWidth) {
        enter.append("text").attr("class", classPrefix + "label");
        var text = svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").data(labels).text(d3_identity);

        if (labelWidth) {
          svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").call(d3_textWrapping, labelWidth);
        }

        return text;
      },

      d3_calcType: function d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter) {
        var type = scale.invertExtent ? d3_quantLegend(scale, labelFormat, labelDelimiter) : scale.ticks ? d3_linearLegend(scale, cells, labelFormat) : d3_ordinalLegend(scale);

        //for d3.scaleSequential that doesn't have a range function
        var range = scale.range && scale.range() || scale.domain();
        type.labels = d3_mergeLabels(type.labels, labels, scale.domain(), range, labelDelimiter);

        if (ascending) {
          type.labels = d3_reverse(type.labels);
          type.data = d3_reverse(type.data);
        }

        return type;
      },

      d3_filterCells: function d3_filterCells(type, cellFilter) {
        var filterCells = type.data.map(function (d, i) {
          return { data: d, label: type.labels[i] };
        }).filter(cellFilter);
        var dataValues = filterCells.map(function (d) {
          return d.data;
        });
        var labelValues = filterCells.map(function (d) {
          return d.label;
        });
        type.data = type.data.filter(function (d) {
          return dataValues.indexOf(d) !== -1;
        });
        type.labels = type.labels.filter(function (d) {
          return labelValues.indexOf(d) !== -1;
        });
        return type;
      },

      d3_placement: function d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign) {
        cell.attr("transform", cellTrans);
        text.attr("transform", textTrans);
        if (orient === "horizontal") {
          text.style("text-anchor", labelAlign);
        }
      },

      d3_addEvents: function d3_addEvents(cells, dispatcher) {
        cells.on("mouseover.legend", function (d) {
          d3_cellOver(dispatcher, d, this);
        }).on("mouseout.legend", function (d) {
          d3_cellOut(dispatcher, d, this);
        }).on("click.legend", function (d) {
          d3_cellClick(dispatcher, d, this);
        });
      },

      d3_title: function d3_title(svg, title, classPrefix, titleWidth) {
        if (title !== "") {
          var titleText = svg.selectAll("text." + classPrefix + "legendTitle");

          titleText.data([title]).enter().append("text").attr("class", classPrefix + "legendTitle");

          svg.selectAll("text." + classPrefix + "legendTitle").text(title);

          if (titleWidth) {
            svg.selectAll("text." + classPrefix + "legendTitle").call(d3_textWrapping, titleWidth);
          }

          var cellsSvg = svg.select("." + classPrefix + "legendCells");
          var yOffset = svg.select("." + classPrefix + "legendTitle").nodes().map(function (d) {
            return d.getBBox().height;
          })[0],
              xOffset = -cellsSvg.nodes().map(function (d) {
            return d.getBBox().x;
          })[0];
          cellsSvg.attr("transform", "translate(" + xOffset + "," + yOffset + ")");
        }
      },

      d3_defaultLocale: {
        format: format,
        formatPrefix: formatPrefix
      },

      d3_defaultFormatSpecifier: ".01f",

      d3_defaultDelimiter: "to"
    };

    function color() {
      var scale = linear(),
          shape = "rect",
          shapeWidth = 15,
          shapeHeight = 15,
          shapeRadius = 10,
          shapePadding = 2,
          cells = [5],
          cellFilter = void 0,
          labels = [],
          classPrefix = "",
          useClass = false,
          title = "",
          locale = helper.d3_defaultLocale,
          specifier = helper.d3_defaultFormatSpecifier,
          labelOffset = 10,
          labelAlign = "middle",
          labelDelimiter = helper.d3_defaultDelimiter,
          labelWrap = void 0,
          orient = "vertical",
          ascending = false,
          path = void 0,
          titleWidth = void 0,
          legendDispatcher = dispatch("cellover", "cellout", "cellclick");

      function legend(svg) {
        var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
            legendG = svg.selectAll("g").data([scale]);

        legendG.enter().append("g").attr("class", classPrefix + "legendCells");

        if (cellFilter) {
          helper.d3_filterCells(type, cellFilter);
        }

        var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);

        var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
        cellEnter.append(shape).attr("class", classPrefix + "swatch");

        var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch").data(type.data);

        //add event handlers
        helper.d3_addEvents(cellEnter, legendDispatcher);

        cell.exit().transition().style("opacity", 0).remove();
        shapes.exit().transition().style("opacity", 0).remove();

        shapes = shapes.merge(shapes);

        helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path);
        var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

        // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
        cell = cellEnter.merge(cell);

        // sets placement
        var textSize = text.nodes().map(function (d) {
          return d.getBBox();
        }),
            shapeSize = shapes.nodes().map(function (d) {
          return d.getBBox();
        });
        //sets scale
        //everything is fill except for line which is stroke,
        if (!useClass) {
          if (shape == "line") {
            shapes.style("stroke", type.feature);
          } else {
            shapes.style("fill", type.feature);
          }
        } else {
          shapes.attr("class", function (d) {
            return classPrefix + "swatch " + type.feature(d);
          });
        }

        var cellTrans = void 0,
            textTrans = void 0,
            textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

        //positions cells and text
        if (orient === "vertical") {
          (function () {
            var cellSize = textSize.map(function (d, i) {
              return Math.max(d.height, shapeSize[i].height);
            });

            cellTrans = function cellTrans(d, i) {
              var height = sum(cellSize.slice(0, i));
              return "translate(0, " + (height + i * shapePadding) + ")";
            };

            textTrans = function textTrans(d, i) {
              return "translate( " + (shapeSize[i].width + shapeSize[i].x + labelOffset) + ", " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
            };
          })();
        } else if (orient === "horizontal") {
          cellTrans = function cellTrans(d, i) {
            return "translate(" + i * (shapeSize[i].width + shapePadding) + ",0)";
          };
          textTrans = function textTrans(d, i) {
            return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n          " + (shapeSize[i].height + shapeSize[i].y + labelOffset + 8) + ")";
          };
        }

        helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
        helper.d3_title(svg, title, classPrefix, titleWidth);

        cell.transition().style("opacity", 1);
      }

      legend.scale = function (_) {
        if (!arguments.length) return scale;
        scale = _;
        return legend;
      };

      legend.cells = function (_) {
        if (!arguments.length) return cells;
        if (_.length > 1 || _ >= 2) {
          cells = _;
        }
        return legend;
      };

      legend.cellFilter = function (_) {
        if (!arguments.length) return cellFilter;
        cellFilter = _;
        return legend;
      };

      legend.shape = function (_, d) {
        if (!arguments.length) return shape;
        if (_ == "rect" || _ == "circle" || _ == "line" || _ == "path" && typeof d === "string") {
          shape = _;
          path = d;
        }
        return legend;
      };

      legend.shapeWidth = function (_) {
        if (!arguments.length) return shapeWidth;
        shapeWidth = +_;
        return legend;
      };

      legend.shapeHeight = function (_) {
        if (!arguments.length) return shapeHeight;
        shapeHeight = +_;
        return legend;
      };

      legend.shapeRadius = function (_) {
        if (!arguments.length) return shapeRadius;
        shapeRadius = +_;
        return legend;
      };

      legend.shapePadding = function (_) {
        if (!arguments.length) return shapePadding;
        shapePadding = +_;
        return legend;
      };

      legend.labels = function (_) {
        if (!arguments.length) return labels;
        labels = _;
        return legend;
      };

      legend.labelAlign = function (_) {
        if (!arguments.length) return labelAlign;
        if (_ == "start" || _ == "end" || _ == "middle") {
          labelAlign = _;
        }
        return legend;
      };

      legend.locale = function (_) {
        if (!arguments.length) return locale;
        locale = formatLocale(_);
        return legend;
      };

      legend.labelFormat = function (_) {
        if (!arguments.length) return legend.locale().format(specifier);
        specifier = formatSpecifier(_);
        return legend;
      };

      legend.labelOffset = function (_) {
        if (!arguments.length) return labelOffset;
        labelOffset = +_;
        return legend;
      };

      legend.labelDelimiter = function (_) {
        if (!arguments.length) return labelDelimiter;
        labelDelimiter = _;
        return legend;
      };

      legend.labelWrap = function (_) {
        if (!arguments.length) return labelWrap;
        labelWrap = _;
        return legend;
      };

      legend.useClass = function (_) {
        if (!arguments.length) return useClass;
        if (_ === true || _ === false) {
          useClass = _;
        }
        return legend;
      };

      legend.orient = function (_) {
        if (!arguments.length) return orient;
        _ = _.toLowerCase();
        if (_ == "horizontal" || _ == "vertical") {
          orient = _;
        }
        return legend;
      };

      legend.ascending = function (_) {
        if (!arguments.length) return ascending;
        ascending = !!_;
        return legend;
      };

      legend.classPrefix = function (_) {
        if (!arguments.length) return classPrefix;
        classPrefix = _;
        return legend;
      };

      legend.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return legend;
      };

      legend.titleWidth = function (_) {
        if (!arguments.length) return titleWidth;
        titleWidth = _;
        return legend;
      };

      legend.textWrap = function (_) {
        if (!arguments.length) return textWrap;
        textWrap = _;
        return legend;
      };

      legend.on = function () {
        var value = legendDispatcher.on.apply(legendDispatcher, arguments);
        return value === legendDispatcher ? legend : value;
      };

      return legend;
    }

    function size() {
      var scale = linear(),
          shape = "rect",
          shapeWidth = 15,
          shapePadding = 2,
          cells = [5],
          cellFilter = void 0,
          labels = [],
          classPrefix = "",
          title = "",
          locale = helper.d3_defaultLocale,
          specifier = helper.d3_defaultFormatSpecifier,
          labelOffset = 10,
          labelAlign = "middle",
          labelDelimiter = helper.d3_defaultDelimiter,
          labelWrap = void 0,
          orient = "vertical",
          ascending = false,
          path = void 0,
          titleWidth = void 0,
          legendDispatcher = dispatch("cellover", "cellout", "cellclick");

      function legend(svg) {
        var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
            legendG = svg.selectAll("g").data([scale]);

        if (cellFilter) {
          helper.d3_filterCells(type, cellFilter);
        }

        legendG.enter().append("g").attr("class", classPrefix + "legendCells");

        var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);
        var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
        cellEnter.append(shape).attr("class", classPrefix + "swatch");

        var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch");

        //add event handlers
        helper.d3_addEvents(cellEnter, legendDispatcher);

        cell.exit().transition().style("opacity", 0).remove();

        shapes.exit().transition().style("opacity", 0).remove();
        shapes = shapes.merge(shapes);

        //creates shape
        if (shape === "line") {
          helper.d3_drawShapes(shape, shapes, 0, shapeWidth);
          shapes.attr("stroke-width", type.feature);
        } else {
          helper.d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature, path);
        }

        var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

        // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
        cell = cellEnter.merge(cell);

        //sets placement

        var textSize = text.nodes().map(function (d) {
          return d.getBBox();
        }),
            shapeSize = shapes.nodes().map(function (d, i) {
          var bbox = d.getBBox();
          var stroke = scale(type.data[i]);

          if (shape === "line" && orient === "horizontal") {
            bbox.height = bbox.height + stroke;
          } else if (shape === "line" && orient === "vertical") {
            bbox.width = bbox.width;
          }
          return bbox;
        });

        var maxH = max(shapeSize, function (d) {
          return d.height + d.y;
        }),
            maxW = max(shapeSize, function (d) {
          return d.width + d.x;
        });

        var cellTrans = void 0,
            textTrans = void 0,
            textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

        //positions cells and text
        if (orient === "vertical") {
          (function () {
            var cellSize = textSize.map(function (d, i) {
              return Math.max(d.height, shapeSize[i].height);
            });
            var y = shape == "circle" || shape == "line" ? shapeSize[0].height / 2 : 0;
            cellTrans = function cellTrans(d, i) {
              var height = sum(cellSize.slice(0, i));

              return "translate(0, " + (y + height + i * shapePadding) + ")";
            };

            textTrans = function textTrans(d, i) {
              return "translate( " + (maxW + labelOffset) + ",\n          " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
            };
          })();
        } else if (orient === "horizontal") {
          (function () {
            cellTrans = function cellTrans(d, i) {
              var width = sum(shapeSize.slice(0, i), function (d) {
                return d.width;
              });
              var y = shape == "circle" || shape == "line" ? maxH / 2 : 0;
              return "translate(" + (width + i * shapePadding) + ", " + y + ")";
            };

            var offset = shape == "line" ? maxH / 2 : maxH;
            textTrans = function textTrans(d, i) {
              return "translate( " + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n              " + (offset + labelOffset) + ")";
            };
          })();
        }

        helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
        helper.d3_title(svg, title, classPrefix, titleWidth);

        cell.transition().style("opacity", 1);
      }

      legend.scale = function (_) {
        if (!arguments.length) return scale;
        scale = _;
        return legend;
      };

      legend.cells = function (_) {
        if (!arguments.length) return cells;
        if (_.length > 1 || _ >= 2) {
          cells = _;
        }
        return legend;
      };

      legend.cellFilter = function (_) {
        if (!arguments.length) return cellFilter;
        cellFilter = _;
        return legend;
      };

      legend.shape = function (_, d) {
        if (!arguments.length) return shape;
        if (_ == "rect" || _ == "circle" || _ == "line") {
          shape = _;
          path = d;
        }
        return legend;
      };

      legend.shapeWidth = function (_) {
        if (!arguments.length) return shapeWidth;
        shapeWidth = +_;
        return legend;
      };

      legend.shapePadding = function (_) {
        if (!arguments.length) return shapePadding;
        shapePadding = +_;
        return legend;
      };

      legend.labels = function (_) {
        if (!arguments.length) return labels;
        labels = _;
        return legend;
      };

      legend.labelAlign = function (_) {
        if (!arguments.length) return labelAlign;
        if (_ == "start" || _ == "end" || _ == "middle") {
          labelAlign = _;
        }
        return legend;
      };

      legend.locale = function (_) {
        if (!arguments.length) return locale;
        locale = formatLocale(_);
        return legend;
      };

      legend.labelFormat = function (_) {
        if (!arguments.length) return legend.locale().format(specifier);
        specifier = formatSpecifier(_);
        return legend;
      };

      legend.labelOffset = function (_) {
        if (!arguments.length) return labelOffset;
        labelOffset = +_;
        return legend;
      };

      legend.labelDelimiter = function (_) {
        if (!arguments.length) return labelDelimiter;
        labelDelimiter = _;
        return legend;
      };

      legend.labelWrap = function (_) {
        if (!arguments.length) return labelWrap;
        labelWrap = _;
        return legend;
      };

      legend.orient = function (_) {
        if (!arguments.length) return orient;
        _ = _.toLowerCase();
        if (_ == "horizontal" || _ == "vertical") {
          orient = _;
        }
        return legend;
      };

      legend.ascending = function (_) {
        if (!arguments.length) return ascending;
        ascending = !!_;
        return legend;
      };

      legend.classPrefix = function (_) {
        if (!arguments.length) return classPrefix;
        classPrefix = _;
        return legend;
      };

      legend.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return legend;
      };

      legend.titleWidth = function (_) {
        if (!arguments.length) return titleWidth;
        titleWidth = _;
        return legend;
      };

      legend.on = function () {
        var value = legendDispatcher.on.apply(legendDispatcher, arguments);
        return value === legendDispatcher ? legend : value;
      };

      return legend;
    }

    /* src/Legend.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/Legend.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (27:1) {#each values as d, i}
    function create_each_block$1(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let text_1;
    	let t_value = /*d*/ ctx[7] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(circle, "cx", circle_cx_value = /*xCircle*/ ctx[3] + /*scale*/ ctx[0](/*d*/ ctx[7]) + /*spacing*/ ctx[5] * /*i*/ ctx[9]);
    			attr_dev(circle, "cy", circle_cy_value = /*yCircle*/ ctx[4] - /*scale*/ ctx[0](/*d*/ ctx[7]));
    			attr_dev(circle, "r", circle_r_value = /*scale*/ ctx[0](/*d*/ ctx[7]));
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke", "black");
    			add_location(circle, file$5, 27, 2, 554);
    			attr_dev(text_1, "x", text_1_x_value = /*xCircle*/ ctx[3] + /*scale*/ ctx[0](/*d*/ ctx[7]) + /*spacing*/ ctx[5] * /*i*/ ctx[9]);
    			attr_dev(text_1, "y", text_1_y_value = /*yCircle*/ ctx[4] + 10);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "font-size", "10");
    			attr_dev(text_1, "fill", "none");
    			attr_dev(text_1, "stroke", "black");
    			add_location(text_1, file$5, 35, 2, 697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xCircle, scale, values*/ 11 && circle_cx_value !== (circle_cx_value = /*xCircle*/ ctx[3] + /*scale*/ ctx[0](/*d*/ ctx[7]) + /*spacing*/ ctx[5] * /*i*/ ctx[9])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*yCircle, scale, values*/ 19 && circle_cy_value !== (circle_cy_value = /*yCircle*/ ctx[4] - /*scale*/ ctx[0](/*d*/ ctx[7]))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*scale, values*/ 3 && circle_r_value !== (circle_r_value = /*scale*/ ctx[0](/*d*/ ctx[7]))) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*values*/ 2 && t_value !== (t_value = /*d*/ ctx[7] + "")) set_data_dev(t, t_value);

    			if (dirty & /*xCircle, scale, values*/ 11 && text_1_x_value !== (text_1_x_value = /*xCircle*/ ctx[3] + /*scale*/ ctx[0](/*d*/ ctx[7]) + /*spacing*/ ctx[5] * /*i*/ ctx[9])) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*yCircle*/ 16 && text_1_y_value !== (text_1_y_value = /*yCircle*/ ctx[4] + 10)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:1) {#each values as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let g;
    	let text_1;
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let each_value = /*values*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			text_1 = svg_element("text");
    			t = text(/*title*/ ctx[2]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(text_1, "x", text_1_x_value = /*xCircle*/ ctx[3] + /*totalLength*/ ctx[6] / 2);
    			attr_dev(text_1, "y", text_1_y_value = /*yCircle*/ ctx[4] - 30);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "font-size", "13");
    			attr_dev(text_1, "fill", "none");
    			attr_dev(text_1, "stroke", "black");
    			add_location(text_1, file$5, 17, 1, 384);
    			attr_dev(g, "class", "legend");
    			add_location(g, file$5, 16, 0, 364);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, text_1);
    			append_dev(text_1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);

    			if (dirty & /*xCircle*/ 8 && text_1_x_value !== (text_1_x_value = /*xCircle*/ ctx[3] + /*totalLength*/ ctx[6] / 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*yCircle*/ 16 && text_1_y_value !== (text_1_y_value = /*yCircle*/ ctx[4] - 30)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*xCircle, scale, values, spacing, yCircle*/ 59) {
    				each_value = /*values*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Legend", slots, []);
    	let { scale } = $$props;
    	let { values } = $$props;
    	let { title } = $$props;
    	let { xCircle = 40 } = $$props;
    	let { yCircle = 40 } = $$props;
    	let spacing = 15;
    	let totalLength = values.map(d => scale(d) + spacing).reduce((a, b) => a + b, 0) - spacing;
    	const writable_props = ["scale", "values", "title", "xCircle", "yCircle"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("scale" in $$props) $$invalidate(0, scale = $$props.scale);
    		if ("values" in $$props) $$invalidate(1, values = $$props.values);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("xCircle" in $$props) $$invalidate(3, xCircle = $$props.xCircle);
    		if ("yCircle" in $$props) $$invalidate(4, yCircle = $$props.yCircle);
    	};

    	$$self.$capture_state = () => ({
    		select: select$1,
    		selectAll,
    		legendSize: size,
    		legendColor: color,
    		scale,
    		values,
    		title,
    		xCircle,
    		yCircle,
    		spacing,
    		totalLength
    	});

    	$$self.$inject_state = $$props => {
    		if ("scale" in $$props) $$invalidate(0, scale = $$props.scale);
    		if ("values" in $$props) $$invalidate(1, values = $$props.values);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("xCircle" in $$props) $$invalidate(3, xCircle = $$props.xCircle);
    		if ("yCircle" in $$props) $$invalidate(4, yCircle = $$props.yCircle);
    		if ("spacing" in $$props) $$invalidate(5, spacing = $$props.spacing);
    		if ("totalLength" in $$props) $$invalidate(6, totalLength = $$props.totalLength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [scale, values, title, xCircle, yCircle, spacing, totalLength];
    }

    class Legend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			scale: 0,
    			values: 1,
    			title: 2,
    			xCircle: 3,
    			yCircle: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*scale*/ ctx[0] === undefined && !("scale" in props)) {
    			console.warn("<Legend> was created without expected prop 'scale'");
    		}

    		if (/*values*/ ctx[1] === undefined && !("values" in props)) {
    			console.warn("<Legend> was created without expected prop 'values'");
    		}

    		if (/*title*/ ctx[2] === undefined && !("title" in props)) {
    			console.warn("<Legend> was created without expected prop 'title'");
    		}
    	}

    	get scale() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xCircle() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xCircle(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yCircle() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yCircle(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Scat.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/Scat.svelte";

    function create_fragment$4(ctx) {
    	let circle;
    	let circle_transform_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "transform", circle_transform_value = `translate(${/*x*/ ctx[0]},${/*y*/ ctx[1]})`);
    			attr_dev(circle, "r", /*r*/ ctx[3]);
    			attr_dev(circle, "fill", /*color*/ ctx[2]);
    			add_location(circle, file$4, 24, 0, 567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(circle, "mouseover", /*sendInfo*/ ctx[4], false, false, false),
    					listen_dev(circle, "mouseout", /*sendInfo*/ ctx[4], false, false, false),
    					listen_dev(circle, "mousemove", /*sendInfo*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*x, y*/ 3 && circle_transform_value !== (circle_transform_value = `translate(${/*x*/ ctx[0]},${/*y*/ ctx[1]})`)) {
    				attr_dev(circle, "transform", circle_transform_value);
    			}

    			if (dirty & /*r*/ 8) {
    				attr_dev(circle, "r", /*r*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 4) {
    				attr_dev(circle, "fill", /*color*/ ctx[2]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Scat", slots, []);
    	let { d } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { color = "black" } = $$props;
    	let { r } = $$props;

    	// console.log(d, x, y)
    	const dispatch = createEventDispatcher();

    	function sendInfo(event) {
    		dispatch(event.type, {
    			text: "Hi there",
    			event,
    			data: { data: d }
    		});
    	}

    	
    	onDestroy(d => console.log("Bubble being destroyed"));
    	const writable_props = ["d", "x", "y", "color", "r"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Scat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("d" in $$props) $$invalidate(5, d = $$props.d);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("r" in $$props) $$invalidate(3, r = $$props.r);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		fade,
    		d,
    		x,
    		y,
    		color,
    		r,
    		dispatch,
    		sendInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ("d" in $$props) $$invalidate(5, d = $$props.d);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    		if ("r" in $$props) $$invalidate(3, r = $$props.r);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [x, y, color, r, sendInfo, d];
    }

    class Scat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { d: 5, x: 0, y: 1, color: 2, r: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scat",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*d*/ ctx[5] === undefined && !("d" in props)) {
    			console_1$2.warn("<Scat> was created without expected prop 'd'");
    		}

    		if (/*x*/ ctx[0] === undefined && !("x" in props)) {
    			console_1$2.warn("<Scat> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[1] === undefined && !("y" in props)) {
    			console_1$2.warn("<Scat> was created without expected prop 'y'");
    		}

    		if (/*r*/ ctx[3] === undefined && !("r" in props)) {
    			console_1$2.warn("<Scat> was created without expected prop 'r'");
    		}
    	}

    	get d() {
    		throw new Error("<Scat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set d(value) {
    		throw new Error("<Scat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Scat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Scat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Scat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Scat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Scat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Scat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<Scat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<Scat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ColorLegend.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/ColorLegend.svelte";

    function create_fragment$3(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$3, 85, 0, 2517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			/*g_binding*/ ctx[6](g);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			/*g_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColorLegend", slots, []);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { scale } = $$props;
    	let { xStart = 500 } = $$props;
    	let { yStart = 30 } = $$props;
    	let el;
    	let legendMargin = { top: 50, bottom: 20, left: 50, right: 20 };
    	const writable_props = ["width", "height", "scale", "xStart", "yStart"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorLegend> was created with unknown prop '${key}'`);
    	});

    	function g_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("scale" in $$props) $$invalidate(3, scale = $$props.scale);
    		if ("xStart" in $$props) $$invalidate(4, xStart = $$props.xStart);
    		if ("yStart" in $$props) $$invalidate(5, yStart = $$props.yStart);
    	};

    	$$self.$capture_state = () => ({
    		axisRight,
    		width,
    		height,
    		scale,
    		xStart,
    		yStart,
    		el,
    		legendMargin
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("scale" in $$props) $$invalidate(3, scale = $$props.scale);
    		if ("xStart" in $$props) $$invalidate(4, xStart = $$props.xStart);
    		if ("yStart" in $$props) $$invalidate(5, yStart = $$props.yStart);
    		if ("el" in $$props) $$invalidate(0, el = $$props.el);
    		if ("legendMargin" in $$props) $$invalidate(7, legendMargin = $$props.legendMargin);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*el, xStart, yStart, scale, width, height*/ 63) {
    			{
    				let legendSvg = d3.select(el).attr("transform", "translate(" + (xStart - legendMargin.left) + "," + (yStart + legendMargin.top) + ")");
    				updateColourScale(scale);

    				// update the colour scale, restyle the plot points and legend
    				function updateColourScale(scale) {
    					// style points
    					// clear current legend
    					legendSvg.selectAll("*").remove();

    					// append gradient bar
    					var gradient = legendSvg.append("defs").append("linearGradient").attr("id", "gradient").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%").attr("spreadMethod", "pad"); // bottom
    					// to top

    					// programatically generate the gradient for the legend
    					// this creates an array of [pct, colour] pairs as stop
    					// values for legend
    					let ticks = scale.ticks();

    					ticks = [30, 40, 50, 60, 70, 80, 90];
    					let pct = ticks.map(d => (d - ticks[0]) / (ticks[ticks.length - 1] - ticks[0]) * 100).map(d => Math.round(d) + "%");
    					var colourPct = d3.zip(pct, ticks.map(d => scale(d)));

    					colourPct.forEach(function (d) {
    						gradient.append("stop").attr("offset", d[0]).attr("stop-color", d[1]).attr("stop-opacity", 1);
    					});

    					legendSvg.append("text").attr("y", -10).attr("text-anchor", "middle").text("Age scale");
    					legendSvg.append("rect").attr("x1", 0).attr("y1", 0).attr("width", width).attr("height", height).style("fill", "url(#gradient)");

    					// // create a scale and axis for the legend
    					var legendScale = d3.scaleLinear().domain(d3.extent(ticks)).range([height, 0]);

    					var legendAxis = axisRight().scale(legendScale).tickValues(ticks).tickFormat(d3.format("d"));
    					legendSvg.append("g").attr("class", "legend axis").attr("transform", "translate(" + width + ", 0)").call(legendAxis);
    				}
    			}
    		}
    	};

    	return [el, width, height, scale, xStart, yStart, g_binding];
    }

    class ColorLegend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			width: 1,
    			height: 2,
    			scale: 3,
    			xStart: 4,
    			yStart: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorLegend",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[1] === undefined && !("width" in props)) {
    			console.warn("<ColorLegend> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<ColorLegend> was created without expected prop 'height'");
    		}

    		if (/*scale*/ ctx[3] === undefined && !("scale" in props)) {
    			console.warn("<ColorLegend> was created without expected prop 'scale'");
    		}
    	}

    	get width() {
    		throw new Error("<ColorLegend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ColorLegend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<ColorLegend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<ColorLegend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<ColorLegend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<ColorLegend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xStart() {
    		throw new Error("<ColorLegend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xStart(value) {
    		throw new Error("<ColorLegend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yStart() {
    		throw new Error("<ColorLegend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yStart(value) {
    		throw new Error("<ColorLegend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Scatterplot2.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/Scatterplot2.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (138:12) {#each congressmen as d}
    function create_each_block(ctx) {
    	let scat;
    	let current;

    	scat = new Scat({
    			props: {
    				d: /*d*/ ctx[25],
    				x: /*xScale*/ ctx[5](/*d*/ ctx[25].x),
    				y: /*yScale*/ ctx[6](/*d*/ ctx[25].y),
    				color: /*colorScale*/ ctx[7](/*d*/ ctx[25][/*colorVar*/ ctx[2]]),
    				r: /*sizeScale*/ ctx[8](/*d*/ ctx[25][/*sizeVar*/ ctx[3]])
    			},
    			$$inline: true
    		});

    	scat.$on("mouseover", /*mouseOver*/ ctx[17]);
    	scat.$on("mouseout", /*mouseOut*/ ctx[19]);
    	scat.$on("mousemove", /*mouseMove*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(scat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scat, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scat_changes = {};
    			if (dirty & /*congressmen*/ 16) scat_changes.d = /*d*/ ctx[25];
    			if (dirty & /*xScale, congressmen*/ 48) scat_changes.x = /*xScale*/ ctx[5](/*d*/ ctx[25].x);
    			if (dirty & /*yScale, congressmen*/ 80) scat_changes.y = /*yScale*/ ctx[6](/*d*/ ctx[25].y);
    			if (dirty & /*colorScale, congressmen, colorVar*/ 148) scat_changes.color = /*colorScale*/ ctx[7](/*d*/ ctx[25][/*colorVar*/ ctx[2]]);
    			if (dirty & /*sizeScale, congressmen, sizeVar*/ 280) scat_changes.r = /*sizeScale*/ ctx[8](/*d*/ ctx[25][/*sizeVar*/ ctx[3]]);
    			scat.$set(scat_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(138:12) {#each congressmen as d}",
    		ctx
    	});

    	return block;
    }

    // (153:0) {#if isHovered}
    function create_if_block(ctx) {
    	let wikipediatooltip;
    	let updating_x;
    	let updating_y;
    	let updating_message;
    	let current;

    	function wikipediatooltip_x_binding(value) {
    		/*wikipediatooltip_x_binding*/ ctx[21](value);
    	}

    	function wikipediatooltip_y_binding(value) {
    		/*wikipediatooltip_y_binding*/ ctx[22](value);
    	}

    	function wikipediatooltip_message_binding(value) {
    		/*wikipediatooltip_message_binding*/ ctx[23](value);
    	}

    	let wikipediatooltip_props = {};

    	if (/*xTool*/ ctx[11] !== void 0) {
    		wikipediatooltip_props.x = /*xTool*/ ctx[11];
    	}

    	if (/*yTool*/ ctx[12] !== void 0) {
    		wikipediatooltip_props.y = /*yTool*/ ctx[12];
    	}

    	if (/*message*/ ctx[10] !== void 0) {
    		wikipediatooltip_props.message = /*message*/ ctx[10];
    	}

    	wikipediatooltip = new WikipediaToolTip({
    			props: wikipediatooltip_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(wikipediatooltip, "x", wikipediatooltip_x_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "y", wikipediatooltip_y_binding));
    	binding_callbacks.push(() => bind(wikipediatooltip, "message", wikipediatooltip_message_binding));

    	const block = {
    		c: function create() {
    			create_component(wikipediatooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wikipediatooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const wikipediatooltip_changes = {};

    			if (!updating_x && dirty & /*xTool*/ 2048) {
    				updating_x = true;
    				wikipediatooltip_changes.x = /*xTool*/ ctx[11];
    				add_flush_callback(() => updating_x = false);
    			}

    			if (!updating_y && dirty & /*yTool*/ 4096) {
    				updating_y = true;
    				wikipediatooltip_changes.y = /*yTool*/ ctx[12];
    				add_flush_callback(() => updating_y = false);
    			}

    			if (!updating_message && dirty & /*message*/ 1024) {
    				updating_message = true;
    				wikipediatooltip_changes.message = /*message*/ ctx[10];
    				add_flush_callback(() => updating_message = false);
    			}

    			wikipediatooltip.$set(wikipediatooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wikipediatooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wikipediatooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wikipediatooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(153:0) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let svg;
    	let axis0;
    	let text0;
    	let t0_value = /*formattedLabels*/ ctx[13][/*xVar*/ ctx[0]] + "";
    	let t0;
    	let axis1;
    	let legend;
    	let colorlegend;
    	let text1;
    	let t1_value = /*formattedLabels*/ ctx[13][/*yVar*/ ctx[1]] + "";
    	let t1;
    	let g;
    	let t2;
    	let if_block_anchor;
    	let current;

    	axis0 = new Axis({
    			props: {
    				width: /*width*/ ctx[15],
    				height: /*height*/ ctx[16],
    				margin: /*margin*/ ctx[14].bottom,
    				scale: /*xScale*/ ctx[5],
    				position: "bottom"
    			},
    			$$inline: true
    		});

    	axis1 = new Axis({
    			props: {
    				width: /*width*/ ctx[15],
    				height: /*height*/ ctx[16],
    				margin: /*margin*/ ctx[14].left,
    				scale: /*yScale*/ ctx[6],
    				position: "left"
    			},
    			$$inline: true
    		});

    	legend = new Legend({
    			props: {
    				title: /*formattedLabels*/ ctx[13][/*sizeVar*/ ctx[3]],
    				scale: /*sizeScale*/ ctx[8],
    				values: [5, 20, 40],
    				xCircle: /*width*/ ctx[15] - 100,
    				ycircle: /*margin*/ ctx[14].bottom
    			},
    			$$inline: true
    		});

    	colorlegend = new ColorLegend({
    			props: {
    				width: 10,
    				height: 100,
    				scale: /*colorScale*/ ctx[7]
    			},
    			$$inline: true
    		});

    	let each_value = /*congressmen*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*isHovered*/ ctx[9] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			svg = svg_element("svg");
    			create_component(axis0.$$.fragment);
    			text0 = svg_element("text");
    			t0 = text(t0_value);
    			create_component(axis1.$$.fragment);
    			create_component(legend.$$.fragment);
    			create_component(colorlegend.$$.fragment);
    			text1 = svg_element("text");
    			t1 = text(t1_value);
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    			attr_dev(text0, "text-anchor", "middle");
    			attr_dev(text0, "x", /*width*/ ctx[15] / 2);
    			attr_dev(text0, "y", /*height*/ ctx[16] - /*margin*/ ctx[14].bottom / 3);
    			attr_dev(text0, "fill", "black");
    			add_location(text0, file$2, 108, 8, 3319);
    			attr_dev(text1, "text-anchor", "middle");
    			attr_dev(text1, "fill", "black");
    			attr_dev(text1, "transform", `translate(${/*margin*/ ctx[14].left / 3}, ${/*height*/ ctx[16] / 2}) rotate(270)`);
    			add_location(text1, file$2, 130, 8, 3909);
    			add_location(g, file$2, 136, 8, 4093);
    			attr_dev(svg, "viewBox", [0, 0, /*width*/ ctx[15], /*height*/ ctx[16]]);
    			attr_dev(svg, "width", /*width*/ ctx[15]);
    			attr_dev(svg, "height", /*height*/ ctx[16]);
    			add_location(svg, file$2, 100, 4, 3092);
    			attr_dev(div, "width", "75%");
    			attr_dev(div, "height", "75%");
    			add_location(div, file$2, 90, 0, 2850);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			mount_component(axis0, svg, null);
    			append_dev(svg, text0);
    			append_dev(text0, t0);
    			mount_component(axis1, svg, null);
    			mount_component(legend, svg, null);
    			mount_component(colorlegend, svg, null);
    			append_dev(svg, text1);
    			append_dev(text1, t1);
    			append_dev(svg, g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const axis0_changes = {};
    			if (dirty & /*xScale*/ 32) axis0_changes.scale = /*xScale*/ ctx[5];
    			axis0.$set(axis0_changes);
    			if ((!current || dirty & /*xVar*/ 1) && t0_value !== (t0_value = /*formattedLabels*/ ctx[13][/*xVar*/ ctx[0]] + "")) set_data_dev(t0, t0_value);
    			const axis1_changes = {};
    			if (dirty & /*yScale*/ 64) axis1_changes.scale = /*yScale*/ ctx[6];
    			axis1.$set(axis1_changes);
    			const legend_changes = {};
    			if (dirty & /*sizeVar*/ 8) legend_changes.title = /*formattedLabels*/ ctx[13][/*sizeVar*/ ctx[3]];
    			if (dirty & /*sizeScale*/ 256) legend_changes.scale = /*sizeScale*/ ctx[8];
    			legend.$set(legend_changes);
    			const colorlegend_changes = {};
    			if (dirty & /*colorScale*/ 128) colorlegend_changes.scale = /*colorScale*/ ctx[7];
    			colorlegend.$set(colorlegend_changes);
    			if ((!current || dirty & /*yVar*/ 2) && t1_value !== (t1_value = /*formattedLabels*/ ctx[13][/*yVar*/ ctx[1]] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*congressmen, xScale, yScale, colorScale, colorVar, sizeScale, sizeVar, mouseOver, mouseOut, mouseMove*/ 918012) {
    				each_value = /*congressmen*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*isHovered*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isHovered*/ 512) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axis0.$$.fragment, local);
    			transition_in(axis1.$$.fragment, local);
    			transition_in(legend.$$.fragment, local);
    			transition_in(colorlegend.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axis0.$$.fragment, local);
    			transition_out(axis1.$$.fragment, local);
    			transition_out(legend.$$.fragment, local);
    			transition_out(colorlegend.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(axis0);
    			destroy_component(axis1);
    			destroy_component(legend);
    			destroy_component(colorlegend);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Scatterplot2", slots, []);
    	let { data } = $$props;
    	let { xVar } = $$props;
    	let { yVar } = $$props;
    	let { colorVar } = $$props;
    	let { sizeVar } = $$props;

    	const formattedLabels = {
    		"nominate_dim1": "Ideology Score (liberal-conservative)",
    		"min_age": "Age on Entering Congress",
    		"max_age": "Max Age in Congress",
    		"age": "Current Age",
    		"cumulative_time_sen_and_house": "Total Time in Congress"
    	};

    	const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    	const width = 600 - margin.left - margin.right;
    	const height = 600 - margin.top - margin.bottom;
    	let congressmen;
    	let xScale;
    	let yScale;
    	let colorScale;
    	let sizeScale;

    	let options = [
    		{
    			id: "min_age",
    			text: "Age when first joining Congress"
    		},
    		{
    			id: "cumulative_time_sen_and_house",
    			text: "Total time spent in Congress"
    		},
    		{ id: "age", text: "Current age" },
    		{
    			id: "nominate_dim1",
    			text: "Liberal-Conservative Dimension"
    		},
    		{
    			id: "nominate_dim2",
    			text: "Hot Topics Dimension"
    		}
    	];

    	// Tool tip
    	let isHovered = false;

    	let message;
    	let xTool;
    	let yTool;

    	function mouseOver(event) {
    		console.log("mouse over happening", event);
    		$$invalidate(10, message = event);
    		$$invalidate(9, isHovered = true);
    		$$invalidate(11, xTool = event.detail.event.clientX + 5);
    		$$invalidate(12, yTool = event.detail.event.clientY + 5);
    	}

    	function mouseMove(event) {
    		$$invalidate(11, xTool = event.detail.event.clientX + 5);
    		$$invalidate(12, yTool = event.detail.event.clientY + 5);
    	}

    	function mouseOut() {
    		$$invalidate(9, isHovered = false);
    	}

    	const writable_props = ["data", "xVar", "yVar", "colorVar", "sizeVar"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Scatterplot2> was created with unknown prop '${key}'`);
    	});

    	function wikipediatooltip_x_binding(value) {
    		xTool = value;
    		$$invalidate(11, xTool);
    	}

    	function wikipediatooltip_y_binding(value) {
    		yTool = value;
    		$$invalidate(12, yTool);
    	}

    	function wikipediatooltip_message_binding(value) {
    		message = value;
    		$$invalidate(10, message);
    	}

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(20, data = $$props.data);
    		if ("xVar" in $$props) $$invalidate(0, xVar = $$props.xVar);
    		if ("yVar" in $$props) $$invalidate(1, yVar = $$props.yVar);
    		if ("colorVar" in $$props) $$invalidate(2, colorVar = $$props.colorVar);
    		if ("sizeVar" in $$props) $$invalidate(3, sizeVar = $$props.sizeVar);
    	};

    	$$self.$capture_state = () => ({
    		Axis,
    		Legend,
    		Scat,
    		WikipediaToolTip,
    		onMount,
    		ColorLegend,
    		data,
    		xVar,
    		yVar,
    		colorVar,
    		sizeVar,
    		formattedLabels,
    		margin,
    		width,
    		height,
    		congressmen,
    		xScale,
    		yScale,
    		colorScale,
    		sizeScale,
    		options,
    		isHovered,
    		message,
    		xTool,
    		yTool,
    		mouseOver,
    		mouseMove,
    		mouseOut
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(20, data = $$props.data);
    		if ("xVar" in $$props) $$invalidate(0, xVar = $$props.xVar);
    		if ("yVar" in $$props) $$invalidate(1, yVar = $$props.yVar);
    		if ("colorVar" in $$props) $$invalidate(2, colorVar = $$props.colorVar);
    		if ("sizeVar" in $$props) $$invalidate(3, sizeVar = $$props.sizeVar);
    		if ("congressmen" in $$props) $$invalidate(4, congressmen = $$props.congressmen);
    		if ("xScale" in $$props) $$invalidate(5, xScale = $$props.xScale);
    		if ("yScale" in $$props) $$invalidate(6, yScale = $$props.yScale);
    		if ("colorScale" in $$props) $$invalidate(7, colorScale = $$props.colorScale);
    		if ("sizeScale" in $$props) $$invalidate(8, sizeScale = $$props.sizeScale);
    		if ("options" in $$props) options = $$props.options;
    		if ("isHovered" in $$props) $$invalidate(9, isHovered = $$props.isHovered);
    		if ("message" in $$props) $$invalidate(10, message = $$props.message);
    		if ("xTool" in $$props) $$invalidate(11, xTool = $$props.xTool);
    		if ("yTool" in $$props) $$invalidate(12, yTool = $$props.yTool);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, xVar, yVar, colorVar, congressmen, sizeVar*/ 1048607) {
    			{
    				$$invalidate(4, congressmen = data.congresses[2020].filter(d => d[xVar] != undefined).filter(d => d[yVar] != undefined).filter(d => !isNaN(d[xVar])).filter(d => !isNaN(d[yVar])).map(d => ({
    					...d,
    					x: Number(d[xVar]),
    					y: Number(d[yVar])
    				})).filter(d => d[colorVar] != undefined).filter(d => d.x !== -99 && d.y !== -99));

    				$$invalidate(5, xScale = d3.scaleLinear().domain(d3.extent(congressmen, d => d.x)).nice().range([margin.left, width - margin.right]));
    				$$invalidate(6, yScale = d3.scaleLinear().domain(d3.extent(congressmen, d => d.y)).nice().range([height - margin.bottom, margin.top]));
    				$$invalidate(7, colorScale = d3.scaleLinear().domain(d3.extent(congressmen, d => d[colorVar])).nice().range(["white", "blue"]));
    				$$invalidate(8, sizeScale = d3.scaleLinear().domain(d3.extent(congressmen, d => d[sizeVar])).nice().range([2, 8]));
    			}
    		}
    	};

    	return [
    		xVar,
    		yVar,
    		colorVar,
    		sizeVar,
    		congressmen,
    		xScale,
    		yScale,
    		colorScale,
    		sizeScale,
    		isHovered,
    		message,
    		xTool,
    		yTool,
    		formattedLabels,
    		margin,
    		width,
    		height,
    		mouseOver,
    		mouseMove,
    		mouseOut,
    		data,
    		wikipediatooltip_x_binding,
    		wikipediatooltip_y_binding,
    		wikipediatooltip_message_binding
    	];
    }

    class Scatterplot2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			data: 20,
    			xVar: 0,
    			yVar: 1,
    			colorVar: 2,
    			sizeVar: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scatterplot2",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[20] === undefined && !("data" in props)) {
    			console_1$1.warn("<Scatterplot2> was created without expected prop 'data'");
    		}

    		if (/*xVar*/ ctx[0] === undefined && !("xVar" in props)) {
    			console_1$1.warn("<Scatterplot2> was created without expected prop 'xVar'");
    		}

    		if (/*yVar*/ ctx[1] === undefined && !("yVar" in props)) {
    			console_1$1.warn("<Scatterplot2> was created without expected prop 'yVar'");
    		}

    		if (/*colorVar*/ ctx[2] === undefined && !("colorVar" in props)) {
    			console_1$1.warn("<Scatterplot2> was created without expected prop 'colorVar'");
    		}

    		if (/*sizeVar*/ ctx[3] === undefined && !("sizeVar" in props)) {
    			console_1$1.warn("<Scatterplot2> was created without expected prop 'sizeVar'");
    		}
    	}

    	get data() {
    		throw new Error("<Scatterplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Scatterplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xVar() {
    		throw new Error("<Scatterplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xVar(value) {
    		throw new Error("<Scatterplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yVar() {
    		throw new Error("<Scatterplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yVar(value) {
    		throw new Error("<Scatterplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorVar() {
    		throw new Error("<Scatterplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorVar(value) {
    		throw new Error("<Scatterplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizeVar() {
    		throw new Error("<Scatterplot2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizeVar(value) {
    		throw new Error("<Scatterplot2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ScatterStory.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/ScatterStory.svelte";

    // (17:4) 
    function create_background_slot(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let scatterplot2;
    	let current;

    	scatterplot2 = new Scatterplot2({
    			props: {
    				data: /*data*/ ctx[0],
    				xVar: "nominate_dim1",
    				yVar: "cumulative_time_sen_and_house",
    				colorVar: "max_age",
    				sizeVar: "cumulative_time_sen_and_house"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			h2 = element$2("h2");
    			h2.textContent = "Age versus Ideology";
    			t1 = space();
    			create_component(scatterplot2.$$.fragment);
    			add_location(h2, file$1, 17, 8, 329);
    			attr_dev(div, "slot", "background");
    			add_location(div, file$1, 16, 4, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			mount_component(scatterplot2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scatterplot2_changes = {};
    			if (dirty & /*data*/ 1) scatterplot2_changes.data = /*data*/ ctx[0];
    			scatterplot2.$set(scatterplot2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scatterplot2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scatterplot2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scatterplot2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot.name,
    		type: "slot",
    		source: "(17:4) ",
    		ctx
    	});

    	return block;
    }

    // (27:4) 
    function create_foreground_slot(ctx) {
    	let div;
    	let section0;
    	let t1;
    	let section1;

    	const block = {
    		c: function create() {
    			div = element$2("div");
    			section0 = element$2("section");
    			section0.textContent = "How does experience in Congress correlate with outcomes like ideology?";
    			t1 = space();
    			section1 = element$2("section");
    			section1.textContent = "In general, the longest serving members of congress tend to be more moderate. There are some exceptions, \\\n            such as Rep. Maxine Waters on the left and Rep. James Sensenbrenner on the right.";
    			attr_dev(section0, "class", "story-part");
    			add_location(section0, file$1, 27, 8, 605);
    			attr_dev(section1, "class", "story-part");
    			add_location(section1, file$1, 29, 8, 737);
    			attr_dev(div, "slot", "foreground");
    			add_location(div, file$1, 26, 4, 573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section0);
    			append_dev(div, t1);
    			append_dev(div, section1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot.name,
    		type: "slot",
    		source: "(27:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let scroller;
    	let current;

    	scroller = new Scroller({
    			props: {
    				$$slots: {
    					foreground: [create_foreground_slot],
    					background: [create_background_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scroller.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scroller, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, data*/ 257) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scroller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ScatterStory", slots, []);
    	let { data } = $$props;

    	// Scroller stuff
    	let count;

    	let index;
    	let offset;
    	let progress;
    	let top = 0.1;
    	let threshold = 0.5;
    	let bottom = 0.9;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ScatterStory> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Scatterplot2,
    		Scroller,
    		data,
    		count,
    		index,
    		offset,
    		progress,
    		top,
    		threshold,
    		bottom
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("count" in $$props) count = $$props.count;
    		if ("index" in $$props) index = $$props.index;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("progress" in $$props) progress = $$props.progress;
    		if ("top" in $$props) top = $$props.top;
    		if ("threshold" in $$props) threshold = $$props.threshold;
    		if ("bottom" in $$props) bottom = $$props.bottom;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class ScatterStory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScatterStory",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<ScatterStory> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<ScatterStory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<ScatterStory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (35:1) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t1;
    	let t2_value = console.log(/*error*/ ctx[2]) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element$2("p");
    			p.textContent = "An error occurred!";
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(p, file, 35, 2, 743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(35:1) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (25:1) {:then data}
    function create_then_block(ctx) {
    	let div0;
    	let t0;
    	let bubblestory;
    	let t1;
    	let div1;
    	let t2;
    	let boxplotstory;
    	let t3;
    	let div2;
    	let t4;
    	let scatterstory;
    	let current;

    	bubblestory = new BubbleStory({
    			props: { data: /*data*/ ctx[1] },
    			$$inline: true
    		});

    	boxplotstory = new BoxplotStory({
    			props: { data: /*data*/ ctx[1] },
    			$$inline: true
    		});

    	scatterstory = new ScatterStory({
    			props: { data: /*data*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element$2("div");
    			t0 = space();
    			create_component(bubblestory.$$.fragment);
    			t1 = space();
    			div1 = element$2("div");
    			t2 = space();
    			create_component(boxplotstory.$$.fragment);
    			t3 = space();
    			div2 = element$2("div");
    			t4 = space();
    			create_component(scatterstory.$$.fragment);
    			attr_dev(div0, "class", "spacer svelte-1nz90ue");
    			add_location(div0, file, 25, 2, 562);
    			attr_dev(div1, "class", "spacer svelte-1nz90ue");
    			add_location(div1, file, 28, 2, 617);
    			attr_dev(div2, "class", "spacer svelte-1nz90ue");
    			add_location(div2, file, 31, 2, 672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(bubblestory, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(boxplotstory, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(scatterstory, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bubblestory.$$.fragment, local);
    			transition_in(boxplotstory.$$.fragment, local);
    			transition_in(scatterstory.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bubblestory.$$.fragment, local);
    			transition_out(boxplotstory.$$.fragment, local);
    			transition_out(scatterstory.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			destroy_component(bubblestory, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			destroy_component(boxplotstory, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			destroy_component(scatterstory, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(25:1) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (23:14)    <p>...waiting</p>  {:then data}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element$2("p");
    			p.textContent = "...waiting";
    			add_location(p, file, 23, 2, 528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(23:14)    <p>...waiting</p>  {:then data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 1,
    		error: 2,
    		blocks: [,,,]
    	};

    	handle_promise(/*data*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			main = element$2("main");
    			h1 = element$2("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			div = element$2("div");
    			t2 = space();
    			info.block.c();
    			attr_dev(h1, "class", "svelte-1nz90ue");
    			add_location(h1, file, 20, 1, 467);
    			attr_dev(div, "class", "spacer svelte-1nz90ue");
    			add_location(div, file, 21, 1, 484);
    			attr_dev(main, "class", "svelte-1nz90ue");
    			add_location(main, file, 19, 0, 459);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, div);
    			append_dev(main, t2);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[1] = child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;

    	let data = Promise.all([
    		d3.json("./data/all_congressmen.json"),
    		d3.json("./data/congress_by_year.json")
    	]).then(d => {
    		const congressmen = d[0];
    		const congresses = d[1];
    		return { congressmen, congresses };
    	});

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		BubbleStory,
    		BoxplotStory,
    		ScatterStory,
    		name,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, data];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'The Rise of the Career Politician'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
