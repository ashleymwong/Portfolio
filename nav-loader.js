// nav-loader.js — fetches nav.html and injects it into every page
(function () {

    // Map page filenames to their nav <li> id
    var pageNavMap = {
        'index.html':         'nav-home',
        '':                   'nav-home',      // root URL
        'about.html':         'nav-about',
        'no-sidebar.html':    'nav-projects',
        'left-sidebar.html':  'nav-experience',
        'right-sidebar.html': 'nav-experience'
    };

    var placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;

    fetch('nav.html')
        .then(function (res) { return res.text(); })
        .then(function (html) {
            placeholder.innerHTML = html;

            // Mark the current page as active
            var page = window.location.pathname.split('/').pop() || '';
            var activeId = pageNavMap[page];
            if (activeId) {
                var activeItem = document.getElementById(activeId);
                if (activeItem) activeItem.classList.add('current_page_item');
            }

            // Re-initialize dropotron and other theme scripts after nav is injected
            if (typeof jQuery !== 'undefined') {
                // Re-trigger dropotron on the newly inserted nav
                jQuery('#nav > ul').dropotron({
                    alignment: 'right',
                    hideDelay: 300
                });
            }

            // Dropdown-on-card-click logic
            window.addEventListener('load', function () {
                var activeNavItem = null;

                function openDropdown(navItemId) {
                    if (activeNavItem) activeNavItem.classList.remove('force-open');
                    var item = document.getElementById(navItemId);
                    if (item) {
                        item.classList.add('force-open');
                        activeNavItem = item;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }

                function closeAll() {
                    document.querySelectorAll('#nav li.force-open').forEach(function (el) {
                        el.classList.remove('force-open');
                    });
                    activeNavItem = null;
                }

                document.querySelectorAll('.card-trigger').forEach(function (el) {
                    el.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var target = this.getAttribute('data-nav');
                        if (activeNavItem && activeNavItem.id === target) {
                            closeAll();
                        } else {
                            openDropdown(target);
                        }
                    });
                });

                document.addEventListener('click', function (e) {
                    if (!e.target.closest('#nav') && !e.target.closest('.card-trigger')) {
                        closeAll();
                    }
                });
            });
        })
        .catch(function (err) {
            console.error('nav-loader: could not load nav.html', err);
        });
})();
