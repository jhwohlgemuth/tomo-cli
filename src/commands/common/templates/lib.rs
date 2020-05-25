use wasm_bindgen::prelude::*;
use web_sys::console;

mod utils;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f64(a: f64);
}

#[wasm_bindgen]
pub fn init() {
    utils::init();
    console::log_1(&JsValue::from_str("WebAssembly Initialized"));
}

#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    init();
    Ok(())
}
