"use client";

import { useState } from "react";

const RATE_PER_SQUARE_FEET = 75;

export default function EstimateCalculator() {
	const [height, setHeight] = useState("");
	const [width, setWidth] = useState("");
	const [estimate, setEstimate] = useState(null);

	function handleSubmit(event) {
		event.preventDefault();

		const heightInFeet = Number(height);
		const widthInFeet = Number(width);

		if (heightInFeet <= 0 || widthInFeet <= 0) {
			setEstimate(null);
			return;
		}

		const area = heightInFeet * widthInFeet;
		setEstimate({
			area,
			total: area * RATE_PER_SQUARE_FEET,
		});
	}

	return (
		<section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
			<div className="mb-6">
				<p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
					Quick estimate
				</p>
				<h2 className="text-2xl font-bold text-slate-900">Calculate your requirement</h2>
				<p className="mt-2 text-slate-600">Enter the height and width in feet.</p>
			</div>

			<form className="space-y-5" onSubmit={handleSubmit}>
				<div className="grid gap-5 sm:grid-cols-2">
					<label className="block text-sm font-semibold text-slate-700">
						Height (feet)
						<select
							className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
							name="height"
							onChange={(event) => setHeight(event.target.value)}
							required
							value={height}
						>
							<option value="">Select height</option>
							{[5, 6, 7, 8, 9, 10].map((heightOption) => (
								<option key={heightOption} value={heightOption}>
									{heightOption}
								</option>
							))}
						</select>
					</label>

					<label className="block text-sm font-semibold text-slate-700">
						Length (feet)
						<input
							className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
							min="0"
							name="width"
							onChange={(event) => setWidth(event.target.value)}
							placeholder="e.g. 10"
							required
							step="any"
							type="number"
							value={width}
						/>
					</label>
				</div>

				<button
					className="w-full rounded-lg bg-yellow-600 px-5 py-3 font-semibold text-white transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
					type="submit"
				>
					Calculate estimate
				</button>
			</form>

			{estimate && (
				<div className="mt-6 border-t border-slate-200 pt-5" aria-live="polite">
					<div className="flex items-end justify-between gap-4">
						<div>
							<p className="text-sm text-slate-600">Estimated area</p>
							<p className="text-xl font-bold text-slate-900">{estimate.area.toFixed(2)} sq feet</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-slate-600">Estimated Total</p>
							<p className="text-2xl font-bold text-emerald-700">{estimate.total.toFixed(2)}</p>
						</div>
					</div>
					<p className="mt-5 text-center text-sm text-slate-500">
						This is an estimated rate. Contact us to get the appropriate price.
					</p>
				</div>
			)}
		</section>
	);
}
