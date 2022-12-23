/**
  Copyright (c) 2015, 2021, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./chart-stack-control-view.html', './chart-stack-control-viewModel', 'text!./component.json', 'css!./chart-stack-control-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('chart-stack-control', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);