<script>
  // Function to check if the URL has `debug=true` or `log=true` parameters
  function isDebugMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true' || urlParams.get('log') === 'true';
  }

  // Function to conditionally log messages based on the URL parameters
  function debugLog(...messages) {
    if (isDebugMode()) {
      console.log(...messages);
    }
  }

  // Debounce function to limit how often adjustContainerPosition runs for subsequent events
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Function to check for elements and log their positions
  function adjustContainerPosition() {
    const countdownBar = document.querySelector('.countdown-bar');
    const container = document.querySelector('.foursiteDonationLightbox-container');
    const footer = document.querySelector('.dl-footer');

    debugLog('Checking elements:');
    debugLog('Countdown Bar:', countdownBar);
    debugLog('Container:', container);
    debugLog('Footer:', footer);

    if (countdownBar && container && footer) {
      const countdownBarTop = countdownBar.getBoundingClientRect().top;
      const footerBottom = footer.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      const spaceBelowFooter = windowHeight - footerBottom;
      const spaceAboveCountdownBar = countdownBarTop;

      debugLog(`Space Above Countdown Bar: ${spaceAboveCountdownBar}px`);
      debugLog(`Space Below Footer: ${spaceBelowFooter}px`);

      debugLog('No position adjustment logic is applied.');
    } else {
      debugLog('One or more required elements were not found.');
    }
  }

  // Debounced version of adjustContainerPosition (200ms) for subsequent events
  const debouncedAdjustPosition = debounce(adjustContainerPosition, 200);

  // Observe changes to the document for the addition of new elements
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Check if the added node is a div with the 'foursiteDonationLightbox' class
        if (node.nodeType === 1 && node.classList.contains('foursiteDonationLightbox')) {
          debugLog('foursiteDonationLightbox div has been added to the page');

          // Look for the iframe inside the "foursiteDonationLightbox" element
          const iframe = node.querySelector('iframe');
          if (iframe) {
            const iframeUrl = iframe.getAttribute('src');
            const match = iframeUrl.match(/\/page\/(\d+)\//);
            if (match) {
              const pageId = match[1];
              debugLog(`Detected iframe page ID: ${pageId}`);

              // Run only if page ID is "97930"
              if (pageId === "97930") {
                const newClass = `iframe-page-${pageId}`;
                node.classList.add(newClass);
                debugLog(`Added class "${newClass}" to foursiteDonationLightbox`);

                // Create the new countdown bar div
                const newDiv = document.createElement('div');
                newDiv.classList.add('countdown-bar');

                // Create an h2 element with the new copy and classes
                const h2Element = document.createElement('h2');
                h2Element.classList.add('h2', 'mb-2xs');
                h2Element.textContent = 'Limited time match';

                // Add the h2 and image to the new div
                newDiv.appendChild(h2Element);
                newDiv.innerHTML += `<img src="https://img1.niftyimages.com/j9g/sq05/yln5" alt="Countdown timer" style="width:100%; max-width: 204px; height: auto;">`;

                // Insert the new div before the .dl-content element
                const dlContent = document.querySelector('.dl-content');
                if (dlContent) {
                  dlContent.insertAdjacentElement('beforebegin', newDiv);
                  debugLog('A countdown bar was added before .dl-content');
                  adjustContainerPosition();
                }
              } else {
                debugLog('The page ID does not match "97930"; script will not run.');
              }
            } else {
              debugLog('No page ID found in iframe URL');
            }
          } else {
            debugLog('No iframe found inside foursiteDonationLightbox');
          }

          observer.disconnect();
        }
      });
    });
  });

  // Start observing the document body for child list changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Adjust position on window resize (debounced)
  window.addEventListener('resize', debouncedAdjustPosition);

  // Listen for changes in the .countdown-bar size (if it dynamically changes)
  const countdownBarObserver = new MutationObserver(() => {
    debouncedAdjustPosition();
  });

  // Start observing changes to the .countdown-bar
  countdownBarObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // Run the adjustContainerPosition function immediately on page load
  document.addEventListener('DOMContentLoaded', adjustContainerPosition);
</script>