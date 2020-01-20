<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_templates
 *
 * @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Templates\Administrator\Helper;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\PluginHelper;

/**
 * Template Helper class.
 *
 * @since  __DEPLOY_VERSION__
 */
abstract class RenderHelper
{
	/**
	 * Decode pagebuilder param and render the elements
	 *
	 * @param   string $param JSON with grids, columns and modules, build by the pagebuilder
	 *
	 * @return  string
	 *
	 * @since   __DEPLOY_VERSION__
	 * @throws \Exception
	 */
	public static function renderElements($param)
	{
		$elements = json_decode($param);

		if (empty($elements))
		{
			throw new \Exception('No elements available');
		}

		PluginHelper::importPlugin('pagebuilder');

		$html = '<div class="container-fluid">' . self::render($elements) . '</div>';

		return $html;
	}

	/**
	 * Retrieve plugin rendering data
	 * Returns false when no matching plugin was found.
	 *
	 * @param   string $name name of element and matching plugin
	 * @param   array  $data element data for the renderer
	 *
	 * @return  array|boolean
	 *
	 * @since   __DEPLOY_VERSION__
	 */
	private static function getPluginRenderer($data)
	{
		$context = 'com_template.pagebuilder.' . $data->type;

		$pluginRenderer = Factory::getApplication()->triggerEvent('onRenderPagebuilderElement', array($context, $data));

		foreach ($pluginRenderer as $plugin)
		{
			if (empty($plugin))
			{
				continue;
			}

			return $plugin;
		}

		return false;
	}

	/**
	 * Render pagebuilder grid
	 *
	 * @param   array $elements blocks that build the website
	 *
	 * @return  string
	 *
	 * @since   __DEPLOY_VERSION__
	 */
	private static function render($elements)
	{
		$html = '';

		foreach ($elements as $element)
		{
			$renderData = self::getPluginRenderer($element);

			// Create default element to fill space
			if (!$renderData)
			{
				$renderData['start'] = '<div>';
				$renderData['end']   = '</div>';
			}

			$html .= $renderData['start'];

			if (!empty($element->options->component))
			{
				$html .= '<jdoc:include type="component" />';
			}
			elseif (!empty($element->options->message))
			{
				$html .= '<jdoc:include type="message" />';
			}

			if (!empty($element->children))
			{
				$html .= self::render($element->children);
			}

			$html .= $renderData['end'];
		}

		return $html;
	}
}
